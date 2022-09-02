export const parseUrl = function(location) {
    var search = location.search.substring(1);
    try {
        return JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) });
    } catch {
        return {};
    }
};