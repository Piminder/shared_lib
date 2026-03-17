export function get_event_id() {
    const size = 14;
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = '';
    var prefix = '';
    const charsLength = chars.length;

    for (let i = 0; i < size; i++) {
        result += chars.charAt(Math.floor(Math.random() * charsLength));
    }

    prefix = "pub_";

    return `${prefix}${result}`;
}