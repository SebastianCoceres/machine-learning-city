export function log(msg, type = "log") {
    console.clear();
    switch (type) {
        case "error":
            console.error(msg)
            break;
        default:
            console.log(msg)
    }

}