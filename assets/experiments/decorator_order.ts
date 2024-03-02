export function decoratorClass1() {
  return function (target: any) {
    console.log('class 1', target);
    return class Mixin1 extends target {
    } as typeof target;
  }
}
export function decoratorClass2() {
  return function (target: any) {
    console.log('class 2', target);
    return class Mixin2 extends target {
    } as typeof target;
  }
}
export function decoratorClass3() {
  return function (target: any) {
    console.log('class 3', target);
    return class Mixin3 extends target {
    } as typeof target;
  }
}

export function decoratorProperty1() {
  return function (target: any, property: string | symbol) {
    console.log('property 1', target, property, target.toggle, target.flag, target.value);
  }
}

export function decoratorProperty2() {
  return function (target: any, property: string | symbol) {
    console.log('property 2', target, property, target.toggle, target.flag, target.value);
  }
}

export function decoratorProperty3() {
  return function (target: any, property: string | symbol) {
    console.log('property 3', target, property, target.toggle, target.flag, target.value);
  }
}

@decoratorClass1()
@decoratorClass2()
class Test1 {
  static orders: string[] = ['hello'];

  @decoratorProperty1()
  toggle: boolean = true;

  @decoratorProperty1()
  flag: number = 1;
}

@decoratorClass3()
class Test2 extends Test1 {
  static orders: string[] = ['world'];

  @decoratorProperty2()
  @decoratorProperty3()
  value: string = 'hello';
}

console.log(Test2.orders);

const test1 = new Test1();
console.log(test1.toggle);
console.log(test1.flag);

const test2 = new Test2();
console.log(test2.toggle);
console.log(test2.flag);
console.log(test2.value);
