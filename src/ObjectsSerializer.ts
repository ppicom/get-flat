export class ObjectSerializer {
  toPlainObject(instanceToSerialize: any) {
    const prototype = Object.getPrototypeOf(instanceToSerialize);
    const allKeysFromObjectAndPrototype = this.getAllPropertyNamesFromTheInstanceAndItsPrototype(instanceToSerialize);

    const namesOfTheGetterFunctionsWithoutUndefinedValues = this.filterOutAllKeysThatAreNotNamesOfGetterFunctions(
      allKeysFromObjectAndPrototype,
      prototype
    );

    const flatObject = this.useTheGettersNamesToGetTheGettersValuesAndAssignThemToAFlatObject(
      namesOfTheGetterFunctionsWithoutUndefinedValues,
      instanceToSerialize
    );

    return flatObject;
  }

  private useTheGettersNamesToGetTheGettersValuesAndAssignThemToAFlatObject(
    namesOfTheGetterFunctions: string[],
    instanceToSerialize: any
  ) {
    return namesOfTheGetterFunctions.reduce<any>((resultingFlatObject, getterFunctionName) => {
      if (typeof instanceToSerialize[getterFunctionName] !== 'undefined') {
        const valueReturnedByGetterFunction = instanceToSerialize[getterFunctionName];

        if (this.theValueReturnedByTheGetterIsAnObject(valueReturnedByGetterFunction)) {
          this.serializeTheValueReturnedByTheGetterFunctionAndAssignItToTheResultingFlatObject(
            valueReturnedByGetterFunction,
            resultingFlatObject,
            getterFunctionName
          );
        } else {
          resultingFlatObject[getterFunctionName] = valueReturnedByGetterFunction;
        }
      }
      return resultingFlatObject;
    }, {});
  }

  private serializeTheValueReturnedByTheGetterFunctionAndAssignItToTheResultingFlatObject(
    valueReturnedByGetterFunction: any,
    resultingFlatObject: any,
    getterFunctionName: string
  ) {
    if (this.theValueReturnedByTheGetterIsAnInstanceOfMap(valueReturnedByGetterFunction)) {
      this.flattenTheMapAndAssignItToTheResultingFlatObject(
        valueReturnedByGetterFunction,
        resultingFlatObject,
        getterFunctionName
      );
    } else if (valueReturnedByGetterFunction.constructor.name === 'Array') {
      resultingFlatObject[getterFunctionName] = valueReturnedByGetterFunction;
    } else {
      resultingFlatObject[getterFunctionName] = this.toPlainObject(valueReturnedByGetterFunction);
    }
  }

  private flattenTheMapAndAssignItToTheResultingFlatObject(
    valueReturnedByGetterFunction: any,
    resultingFlatObject: any,
    getterFunctionName: string
  ) {
    // The following loop is necessary because maps
    // are directly converted to {} but we want {"key":"value"}
    const map = valueReturnedByGetterFunction as Map<string, any>;
    const flatMap: any = {};
    Array.from(map.entries()).forEach(([key, value]) => {
      if (value instanceof Object) {
        flatMap[key] = this.toPlainObject(value);
      } else {
        flatMap[key] = value;
      }
    });

    resultingFlatObject[getterFunctionName] = flatMap;
  }

  private theValueReturnedByTheGetterIsAnInstanceOfMap(valueReturnedByGetterFunction: any) {
    return valueReturnedByGetterFunction.constructor.name === 'Map';
  }

  private theValueReturnedByTheGetterIsAnObject(valueReturnedByGetterFunction: any) {
    return valueReturnedByGetterFunction instanceof Object;
  }

  private filterOutAllKeysThatAreNotNamesOfGetterFunctions(allKeysFromObjectAndPrototype: string[], prototype: any) {
    const namesOfTheGetterFunctions = allKeysFromObjectAndPrototype
      .map((key) => {
        const propertyDescriptorFromAproperty = Object.getOwnPropertyDescriptor(prototype, key);
        return propertyDescriptorFromAproperty;
      })
      .map((propertyDescriptor, index) => {
        if (propertyDescriptor && typeof propertyDescriptor.get === 'function') {
          return allKeysFromObjectAndPrototype[index];
        } else {
          return undefined;
        }
      })
      .filter((d) => d !== undefined);

    const namesOfTheGetterFunctionsWithoutUndefinedValues = namesOfTheGetterFunctions as string[];
    return namesOfTheGetterFunctionsWithoutUndefinedValues;
  }

  private getAllPropertyNamesFromTheInstanceAndItsPrototype(instanceToSerialize: any) {
    const keysFromInstanceObj = Object.keys(instanceToSerialize);
    const propertyNamesFromInstance = Object.getOwnPropertyNames(instanceToSerialize);
    const propertyNamesFromPrototype = Object.getOwnPropertyNames(Object.getPrototypeOf(instanceToSerialize));

    const AllKeysFromObjectAndPrototype = [
      ...keysFromInstanceObj,
      ...propertyNamesFromInstance,
      ...propertyNamesFromPrototype,
    ];
    return AllKeysFromObjectAndPrototype;
  }
}
