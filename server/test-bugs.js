// TEMPORARY FILE - testing SonarQube bug detection

function calculateTotal(price, quantity) {
    var total = price * quantity;
    return total;
    console.log("This line is unreachable"); // unreachable code
}

function checkUser(user) {
    if (user.isAdmin = true) { // assignment instead of comparison (real bug)
        return "admin access granted";
    }
    return "no access";
}

function fetchData() {
    try {
        JSON.parse("{invalid json");
    } catch (e) {
        // empty catch block - swallowed exception
    }
}

function unusedVarExample() {
    let unusedVariable = 42; // declared but never used
    return "done";
}

if (1 == 1) { // should use === in JS/TS
    console.log("loose equality check");
}
