export function exampleDecorator() {
  console.log("exampleDecorator(): evaluated");
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("exampleDecorator(): called");
  }
}