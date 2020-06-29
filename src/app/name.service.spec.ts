import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


import { NameService, User } from './name.service';

const FAKE_NAME_RESPONSE: User[] = [
  {name: 'John Doe'},
  {name: 'Jane Doe'},
  {name: 'Jo Doe'},
];

const FAKE_EMPTY_NAMES_RESPONSE: User[] = [
  {name: ''},
  {name: ' '},
  // Include all of the names specified above.
  ...FAKE_NAME_RESPONSE,
  {name: '  '},
  {name: '\t'},
];

const EXPECTED_NAME_LIST: string[] = [
  'John Doe',
  'Jane Doe',
  'Jo Doe',
];

describe('NameService', () => {
  let service: NameService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NameService],
    });
    injector = getTestBed();

    // Provided via NameService (injected in root, no module needed)
    service = injector.inject(NameService);
    // Provided via HttpClientTestingModule
    httpMock = injector.inject(HttpTestingController);
  });

  // Verify there are no outstanding http calls
  afterEach(() => {
    httpMock.verify();
  });

  it('should return extracted names from the service', () => {
    // Set the expectation
    service.getNames().subscribe((nameList) => {
      expect(nameList).toEqual(EXPECTED_NAME_LIST);
    });

    const req = httpMock.expectOne('http://jsonplaceholder.typicode.com/users');
    expect(req.request.method).toBe('GET');
    req.flush(FAKE_NAME_RESPONSE);
  });

  it('should filter out all names that are empty', () => {
    // Set the expectation
    service.getNames().subscribe((nameList) => {
      expect(nameList).toEqual(EXPECTED_NAME_LIST);
    });

    const req = httpMock.expectOne('http://jsonplaceholder.typicode.com/users');
    expect(req.request.method).toBe('GET');
    req.flush(FAKE_EMPTY_NAMES_RESPONSE);
  });
});
