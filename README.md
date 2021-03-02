# AutomaticFormBuilder

Automates [@angular/forms](https://www.npmjs.com/package/@angular/forms) form creation,
by interpreting the ValidationMetadata from [class-validator](https://www.npmjs.com/package/class-validator).

It requires the PeerDependencies of @angular/core, @angular/forms, class-transformer and class-validator to be installed to work.

#### Installation

##### npm via git

- npm install `git+https://github.com/TheRealKoeDev/automatic-form-builder.git` @angular/core @angular/forms class-validator class-transformer


## Usage

<details>
<summary>Imports</summary>
    
```typescript
import { FormGroup } from '@angular/forms';
import { 
    AutomaticFormBuilder,
    FormBuildMode,
    MissingArrayHandling,
    MissingObjectHandling
} from 'automatic-form-builder'
import { 
    IsArray,
    IsNotEmpty,
    IsString,
    ValidateNested
} from "class-validator";
import { 
    Type
} from "class-transformer";
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
    // Does not build this property, because it has no Decorator from class-validator 
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
    public form: FormGroup
    
    public constructor(automaticFormBuilder: AutomaticFormBuilder){
        // Builds the whole FormGroup
        this.form = automaticFormBuilder.build(ParentClass);
        
        // Builds the whole FormGroup with the provided data
        this.form = automaticFormBuilder.build(ParentClass, { primitiveProperty: 'some text' });
        
        /**
         *   Builds the FormGroup for ParentClass with only the control for 'primitiveProperty'
         **/ 
        this.form = automaticFormBuilder.build(ParentClass, { primitiveProperty: 'some other text' }, {
            formBuildMode: FormBuildMode.ProvidedDataOnly
        });

        /**
         *   Builds the FormGroup for ParentClass with all direct child controls,  
         *   and writes a FormControl with value null, for ChildArrays and ChildObjects that are not provided in the data.
         **/ 
        this.form = automaticFormBuilder.build(ParentClass, { }, {
            formBuildMode: FormBuildMode.ProvidedObjectsOnly,
            missingObjectHandling: MissingObjectHandling.WriteNull,
            missingArrayHandling: MissingArrayHandling.WriteNull
        });
    }
}

```

#### Notes 
- You can also specify a custom internal FormBuilder via the token `FORM_BUILDER_TOKEN` if you want to use the builder from [@ng-stack/forms](https://www.npmjs.com/package/@ng-stack/forms) for example.

