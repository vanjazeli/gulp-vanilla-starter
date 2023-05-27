class Person {
	constructor(name, age) {
		this.name = name;
		this.age = age;
		this.printName = () => {
			console.log(this.name);
		};
	}
}

const johnDoe = new Person('John Doe', 22);
