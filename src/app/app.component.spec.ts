import { MatInputHarness } from '@angular/material/input/testing';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { NameService } from './name.service';
import { AppModule } from './app.module';
import { MatAutocomplete } from '@angular/material/autocomplete';

describe('AppComponent', () => {
  let nameServiceSpy: jasmine.SpyObj<NameService>;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let loader: HarnessLoader;

  beforeEach(async(() => {
    // Create jasmine spy object, spying on the enumerated method getNames
    nameServiceSpy = jasmine.createSpyObj('NameService', ['getNames']);

    TestBed.configureTestingModule({
      imports: [
        // Import the component module to provide AppComponent dependencies.
        AppModule,
      ],
      providers: [
        // Provide the service via the spy
        {
          provide: NameService,
          useValue: nameServiceSpy,
        },
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();

    nameServiceSpy.getNames.and.returnValue(of([
      'Jane Doe',
      'John Doe',
      'Nicholas Cobb',
    ]));

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  }));

  it('returns names of which the input is a substring', async () => {
    // Get input harness.
    const inputHarness = await loader.getHarness(
        MatInputHarness.with({selector: '.step-test-input'}));

    // Set input text to "Doe"
    await inputHarness.setValue('Doe');

    // Get autocomplete harness.
    const autoCompleteHarness = await loader.getHarness(
      MatAutocompleteHarness.with({selector: '.step-test-input'}));

    // Get the options from the autocomplete harness
    const options = await getOptions(autoCompleteHarness);

    // Check that the appropriate options are remaining
    expect(options).toEqual(jasmine.arrayContaining(['John Doe', 'Jane Doe']));
    // jasmine.arrayContaining only checks that the elements specified are present in
    // the expect() method. In order to verify that the array only contains these
    // elements, verify that the length is 2 (i.e only the two strings above). 
    expect(options.length).toEqual(2);
  });

  it('returns names of which the input is a substring independent of capitalization', async () => {
    const inputHarness = await loader.getHarness(
        MatInputHarness.with({selector: '.step-test-input'}));

    await inputHarness.setValue('coBb');

    const autoCompleteHarness = await loader.getHarness(
      MatAutocompleteHarness.with({selector: '.step-test-input'}));

    const options = await getOptions(autoCompleteHarness);

    expect(options).toEqual(jasmine.arrayContaining(['Nicholas Cobb']));
    expect(options.length).toEqual(1);
  });

  it('returns no option if the input is empty', async () => {
    const autoCompleteHarness = await loader.getHarness(
      MatAutocompleteHarness.with({selector: '.step-test-input'}));

    const options = await getOptions(autoCompleteHarness);

    expect(options.length).toEqual(0);
  });

  async function getOptions(autoCompleteHarness: MatAutocompleteHarness): Promise<string[]> {
    // Get options from the harness.
    const options = await autoCompleteHarness.getOptions();

    const optionTextPromises: Promise<string>[] = options.map(async (option) => {
      // Get text from the harness.
      const text = await option.getText();
      return text;
    });

    // Merge the array of text promises into a single array.
    return Promise.all(optionTextPromises);
  }
});
