( function () {
	var outerVariable = 'Hello';

	// Test for closure and scope
	function ClosureScopeTest() {
		var innerVariable = 'World';

		function innerFunction() {
			return outerVariable + ' ' + innerVariable;
		}

		return innerFunction;
	}
	window.ClosureScopeTest = ClosureScopeTest();

	// Test for object methods and private variables
	function ObjectMethodTest() {
		var secret = 'hidden';

		return {
			getSecret: function () {
				return secret;
			},
			setSecret: function ( newSecret ) {
				secret = newSecret;
			},
		};
	}
	window.ObjectMethodTest = ObjectMethodTest();

	// Test for higher-order functions
	function HigherOrderFunctionTest( callback ) {
		return callback( 10, 5 );
	}
	window.HigherOrderFunctionTest = HigherOrderFunctionTest;

	// Test for asynchronous functions using setTimeout
	function AsyncFunctionTest( callback ) {
		setTimeout( function () {
			callback( 'Async response' );
		}, 300 );
	}
	window.AsyncFunctionTest = AsyncFunctionTest;

	// Test for variable scoping and shadowing
	function VariableScopeTest() {
		var a = 10;
		if ( true ) {
			var a = 20; // Shadowing the outer variable 'a'
			return a;
		}
		return a;
	}
	window.VariableScopeTest = VariableScopeTest;

	// Test for function hoisting
	function HoistingTest() {
		return hoistedFunction();

		function hoistedFunction() {
			return 'hoisted';
		}
	}
	window.HoistingTest = HoistingTest;

	// Test for ES6 arrow functions
	const ArrowFunctionTest = () => 'arrow function';
	window.ArrowFunctionTest = ArrowFunctionTest;

	// Test for conditional expressions
	function ConditionalTest( x ) {
		return x ? 'truthy' : 'falsy';
	}
	window.ConditionalTest = ConditionalTest;

	// Test for error handling with try-catch
	function ErrorHandlingTest() {
		try {
			throw new Error( 'test error' );
		} catch ( e ) {
			return 'caught';
		}
	}
	window.ErrorHandlingTest = ErrorHandlingTest;

	// Test for loops and iteration
	function LoopTest() {
		let sum = 0;
		for ( let i = 0; i < 5; i++ ) {
			sum += i;
		}
		return sum;
	}
	window.LoopTest = LoopTest;
} )();
