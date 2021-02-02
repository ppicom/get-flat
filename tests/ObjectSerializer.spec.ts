/* eslint-disable no-unused-vars */ // Eslint is not able to detect that the enums in the tests are actually being used.
/* eslint-disable no-undef */
import { ObjectSerializer } from '../src/ObjectsSerializer';

describe('Object Serializer', function () {
  const serializer = new ObjectSerializer();

  describe('Direct properties, no nesting', function () {
    it('Serializes an instance with a string property', function () {
      class Hat {
        private _hatName: string;

        constructor() {
          this._hatName = 'Hattie';
        }

        public get hatName() {
          return this._hatName;
        }
      }

      const hat = new Hat();

      const serializedHat = serializer.toPlainObject(hat);

      expect(serializedHat).toHaveProperty('hatName', 'Hattie');
      expect(serializedHat).not.toHaveProperty('_hatName');
    });

    it('Should serialize an instance with an enum to boolean map', function () {
      enum ShapesEnum {
        SQUARE = 'SQUARE',
        ROUND = 'ROUND',
      }

      class Hat {
        private _shapesMap: Map<ShapesEnum, boolean>;

        constructor() {
          this._shapesMap = new Map<ShapesEnum, boolean>([
            [ShapesEnum.ROUND, false],
            [ShapesEnum.SQUARE, true],
          ]);
        }

        public get shapesMap() {
          return this._shapesMap;
        }
      }

      const hat = new Hat();

      const serializedHat = serializer.toPlainObject(hat);

      expect(serializedHat).toHaveProperty('shapesMap');
      expect(serializedHat.shapesMap[ShapesEnum.SQUARE]).toEqual(true);
      expect(serializedHat.shapesMap[ShapesEnum.ROUND]).toEqual(false);
      expect(serializedHat).not.toHaveProperty('_shapesMap');
    });

    it('Serializes an instance with a boolean property', function () {
      class Hat {
        private _isComfy: boolean;

        constructor() {
          this._isComfy = true;
        }

        public get isComfy() {
          return this._isComfy;
        }
      }

      const hat = new Hat();

      const serializedHat = serializer.toPlainObject(hat);

      expect(serializedHat).toHaveProperty('isComfy', true);
      expect(serializedHat).not.toHaveProperty('_isComfy');
    });

    it('Serializes an instance with a number property', function () {
      class Hat {
        private _size: number;

        constructor() {
          this._size = 12;
        }

        public get size() {
          return this._size;
        }
      }

      const hat = new Hat();

      const serializedHat = serializer.toPlainObject(hat);

      expect(serializedHat).toHaveProperty('size', 12);
      expect(serializedHat).not.toHaveProperty('_size');
    });

    it('Serializes an instance with an array property', function () {
      class Hat {
        private _sizes: number[];

        constructor() {
          this._sizes = [12];
        }

        public get sizes() {
          return this._sizes;
        }
      }

      const hat = new Hat();

      const serializedHat = serializer.toPlainObject(hat);

      expect(serializedHat).toHaveProperty('sizes');
      expect(serializedHat).not.toHaveProperty('_sizes');
      expect(serializedHat.sizes).toBeInstanceOf(Array);
      expect(serializedHat.sizes).toHaveLength(1);
    });

    it('Serializes an instance with a string enum property', function () {
      enum Color {
        RED = 'RED',
      }

      class Hat {
        private _color: Color;

        constructor() {
          this._color = Color.RED;
        }

        public get color() {
          return this._color;
        }
      }

      const hat = new Hat();

      const serializedHat = serializer.toPlainObject(hat);

      expect(serializedHat).toHaveProperty('color', 'RED');
      expect(serializedHat).not.toHaveProperty('_color');
    });

    it('Serializes an instance with a number enum property', function () {
      enum ColorCode {
        RED,
      }

      class Hat {
        private _color: ColorCode;

        constructor() {
          this._color = ColorCode.RED;
        }

        public get color() {
          return this._color;
        }
      }

      const hat = new Hat();

      const serializedHat = serializer.toPlainObject(hat);

      expect(serializedHat).toHaveProperty('color', 0);
      expect(serializedHat).not.toHaveProperty('_color');
    });

    it('Serializes an instance with a an object property', function () {
      class Cat {
        private _name: string;

        constructor() {
          this._name = 'Fluffy';
        }

        public get name() {
          return this._name;
        }
      }

      class Hat {
        private _catInTheHat: Cat;

        constructor(theCatInTheHat: Cat) {
          this._catInTheHat = theCatInTheHat;
        }

        public get catInTheHat() {
          return this._catInTheHat;
        }
      }

      const cat = new Cat();
      const hat = new Hat(cat);

      const serializedHat = serializer.toPlainObject(hat);

      expect(serializedHat).toHaveProperty('catInTheHat');
      expect(serializedHat).not.toHaveProperty('_catInTheHat');
      expect(serializedHat.catInTheHat).toHaveProperty('name', 'Fluffy');
    });
  });

  describe('Map properties', function () {
    it('Serializes a string to string map', function () {
      class Hat {
        private _types: Map<string, string>;

        constructor() {
          this._types = new Map<string, string>([
            ['type1', 'Amazing'],
            ['type2', 'Show'],
          ]);
        }

        public get types() {
          return this._types;
        }
      }

      const hat = new Hat();

      const serializedHat = serializer.toPlainObject(hat);

      expect(serializedHat).toHaveProperty('types');
      expect(serializedHat).not.toHaveProperty('_types');
      expect(serializedHat.types).toHaveProperty('type1', 'Amazing');
      expect(serializedHat.types).toHaveProperty('type2', 'Show');
    });

    it('Serializes a string to instance map', function () {
      class Cat {
        private _name: string;

        constructor(name: string) {
          this._name = name;
        }

        public get name() {
          return this._name;
        }
      }

      class Hat {
        private _cats: Map<string, Cat>;

        constructor() {
          this._cats = new Map<string, Cat>([
            ['cat1', new Cat('Amazing')],
            ['cat2', new Cat('Show')],
          ]);
        }

        public get cats() {
          return this._cats;
        }
      }

      const hat = new Hat();

      const serializedHat = serializer.toPlainObject(hat);

      expect(serializedHat.cats.cat1).toHaveProperty('name', 'Amazing');
      expect(serializedHat.cats.cat2).toHaveProperty('name', 'Show');
      expect(serializedHat).not.toHaveProperty('_cats');
    });
  });
});
