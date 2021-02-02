# get-flat

Turn class instances into plain js objects making use of the instance's getters.

Turn this:

```ts
class Hat {
  private _hatName: string;

  constructor(hatName: string) {
    this._hatName = hatName;
  }

  public get hatName() {
    return this._hatName;
  }
}
```

Into this:

```js
{
  hatName: 'name';
}
```

By doing this:

```ts
import { ObjectSerializer } from 'get-flat';

const serializer = new ObjectSerializer();

const hat = new Hat('name');
const flatHat = serializer.toPlainObject(hat);
```
