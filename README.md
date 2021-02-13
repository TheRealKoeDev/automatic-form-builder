# AutomaticFormBuilder

Automates [@ng-stack/forms](https://www.npmjs.com/package/@ng-stack/forms) form creation,
by interpreting the ValidationMetadata from [class-validator](https://www.npmjs.com/package/class-validator).

It requires the PeerDependencies of @ng-stack/forms, class-transformer and class-validator to be installed to work.

#### Installation

##### npm
````
npm install automatic-form-builder
npm install @ng-stack/forms
npm install class-validator
npm install class-transformer
````

##### npm via git
````
npm install git+https://github.com/TheRealKoeDev/automatic-form-builder.git
npm install @ng-stack/forms
npm install class-validator
npm install class-transformer
````

## Usage

<details>
<summary>Imports</summary>
    
```typescript
import { FormGroup } from '@ng-stack/forms';
import { 
    AutomaticFormBuilder,
    FormBuildMode,
    MissingArrayHandling,
    MissingObjectHandling,
    ValidationMode
} from 'automatic-form-builder'
import { 
    IsArray,
    IsNotEmpty,
    IsString,
    ValidateNested
} from "class-validator";
import { Type } from 'class-transformer';
```
</details>
<details>
<summary>Classes for Usage-Example</summary>
    
```typescript
class ChildClass {
    @IsString()
    public testPropety: string;
}

class ParentClass {
    // Does not build this property, because it has no Decorator from @ng-stack/forms 
    public unbuildProperty: unknown;
    
    @IsString()
    public primitiveProperty: string;
    
    @IsArray()
    @IsString({ each: true })
    public primitiveArrayProperty: string[];
    
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ChildClass)
    public objectProperty: ChildClass;    
   
    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => ChildClass)
    public objectArrayProperty: ChildClass[];
}
```
</details>

```typescript
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    public form: FormGroup<ParentClass>:
    
    public constructor(automaticFormBuilder: AutomaticFormBuilder){
        // Builds the whole FormGroup
        this.form = automaticFormBuilder.build(ParentClass);
        
        // Builds the whole FormGroup with the provided data
        this.form = automaticFormBuilder.build(ParentClass, { primitiveProperty: 'some text' });
        
        /**
         *   Builds the FormGroup for ParentClass with only the control for 'primitiveProperty'  
         *   and skips validation for other not existing FormControls.
         **/ 
        this.form = automaticFormBuilder.build(ParentClass, { primitiveProperty: 'some other text' }, {
            validation: ValidationMode.ValidateExistingProperties,
            formBuildMode: FormBuildMode.ProvidedDataOnly
        });

        /**
         *   Builds the FormGroup for ParentClass with all direct child controls,  
         *   skips validation completely and writes a FormControl with value null
         *   for ChildArrays and ChildObjects that are not provided in the data.
         **/ 
        this.form = automaticFormBuilder.build(ParentClass, { }, {
            validation: ValidationMode.None,
            formBuildMode: FormBuildMode.ProvidedObjectsOnly,
            missingObjectHandling: MissingObjectHandling.WriteNull,
            missingArrayHandling: MissingArrayHandling.WriteNull
        });
    }
}

```
