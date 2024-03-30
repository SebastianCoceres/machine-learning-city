export function log(msg, type = "log") {
    // console.clear();
    const uri = new URL(window.location.href);
    if (uri.searchParams.get("debug") === "true") {
        switch (type) {
            case "error":
                console.error(msg)
                break;
            case "dir":
                console.dir(msg)
                break;
            default:
                console.log(msg)
        }
    }


}