"use strict";
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Selector = exports.Zeus = exports.Subscription = exports.SubscriptionThunder = exports.Chain = exports.Thunder = exports.apiSubscription = exports.apiFetch = exports.resolverFor = exports.$ = exports.fullSubscriptionConstruct = exports.fullChainConstruct = exports.queryConstruct = exports.TypesPropsResolver = exports.ScalarResolver = exports.ZeusSelect = exports.GraphQLError = void 0;
const const_1 = require("./const");
class GraphQLError extends Error {
    constructor(response) {
        super("");
        this.response = response;
        console.error(response);
    }
    toString() {
        return "GraphQL Response Error";
    }
}
exports.GraphQLError = GraphQLError;
const ZeusSelect = () => ((t) => t);
exports.ZeusSelect = ZeusSelect;
const ScalarResolver = (scalar, value) => {
    switch (scalar) {
        case 'String':
            return `${JSON.stringify(value)}`;
        case 'Int':
            return `${value}`;
        case 'Float':
            return `${value}`;
        case 'Boolean':
            return `${value}`;
        case 'ID':
            return `"${value}"`;
        case 'enum':
            return `${value}`;
        case 'scalar':
            return `${value}`;
        default:
            return false;
    }
};
exports.ScalarResolver = ScalarResolver;
const TypesPropsResolver = ({ value, type, name, key, blockArrays }) => {
    if (value === null) {
        return `null`;
    }
    let resolvedValue = const_1.AllTypesProps[type][name];
    if (key) {
        resolvedValue = resolvedValue[key];
    }
    if (!resolvedValue) {
        throw new Error(`Cannot resolve ${type} ${name}${key ? ` ${key}` : ''}`);
    }
    const typeResolved = resolvedValue.type;
    const isArray = resolvedValue.array;
    const isArrayRequired = resolvedValue.arrayRequired;
    if (typeof value === 'string' && value.startsWith(`ZEUS_VAR$`)) {
        const isRequired = resolvedValue.required ? '!' : '';
        let t = `${typeResolved}`;
        if (isArray) {
            if (isRequired) {
                t = `${t}!`;
            }
            t = `[${t}]`;
            if (isArrayRequired) {
                t = `${t}!`;
            }
        }
        else {
            if (isRequired) {
                t = `${t}!`;
            }
        }
        return `\$${value.split(`ZEUS_VAR$`)[1]}__ZEUS_VAR__${t}`;
    }
    if (isArray && !blockArrays) {
        return `[${value
            .map((v) => (0, exports.TypesPropsResolver)({ value: v, type, name, key, blockArrays: true }))
            .join(',')}]`;
    }
    const reslovedScalar = (0, exports.ScalarResolver)(typeResolved, value);
    if (!reslovedScalar) {
        const resolvedType = const_1.AllTypesProps[typeResolved];
        if (typeof resolvedType === 'object') {
            const argsKeys = Object.keys(resolvedType);
            return `{${argsKeys
                .filter((ak) => value[ak] !== undefined)
                .map((ak) => `${ak}:${(0, exports.TypesPropsResolver)({ value: value[ak], type: typeResolved, name: ak })}`)}}`;
        }
        return (0, exports.ScalarResolver)(const_1.AllTypesProps[typeResolved], value);
    }
    return reslovedScalar;
};
exports.TypesPropsResolver = TypesPropsResolver;
const isArrayFunction = (parent, a) => {
    const [values, r] = a;
    const [mainKey, key, ...keys] = parent;
    const keyValues = Object.keys(values).filter((k) => typeof values[k] !== 'undefined');
    if (!keys.length) {
        return keyValues.length > 0
            ? `(${keyValues
                .map((v) => `${v}:${(0, exports.TypesPropsResolver)({
                value: values[v],
                type: mainKey,
                name: key,
                key: v
            })}`)
                .join(',')})${r ? traverseToSeekArrays(parent, r) : ''}`
            : traverseToSeekArrays(parent, r);
    }
    const [typeResolverKey] = keys.splice(keys.length - 1, 1);
    let valueToResolve = const_1.ReturnTypes[mainKey][key];
    for (const k of keys) {
        valueToResolve = const_1.ReturnTypes[valueToResolve][k];
    }
    const argumentString = keyValues.length > 0
        ? `(${keyValues
            .map((v) => `${v}:${(0, exports.TypesPropsResolver)({
            value: values[v],
            type: valueToResolve,
            name: typeResolverKey,
            key: v
        })}`)
            .join(',')})${r ? traverseToSeekArrays(parent, r) : ''}`
        : traverseToSeekArrays(parent, r);
    return argumentString;
};
const resolveKV = (k, v) => typeof v === 'boolean' ? k : typeof v === 'object' ? `${k}{${objectToTree(v)}}` : `${k}${v}`;
const objectToTree = (o) => `{${Object.keys(o).map((k) => `${resolveKV(k, o[k])}`).join(' ')}}`;
const traverseToSeekArrays = (parent, a) => {
    if (!a)
        return '';
    if (Object.keys(a).length === 0) {
        return '';
    }
    let b = {};
    if (Array.isArray(a)) {
        return isArrayFunction([...parent], a);
    }
    else {
        if (typeof a === 'object') {
            Object.keys(a)
                .filter((k) => typeof a[k] !== 'undefined')
                .forEach((k) => {
                if (k === '__alias') {
                    Object.keys(a[k]).forEach((aliasKey) => {
                        const aliasOperations = a[k][aliasKey];
                        const aliasOperationName = Object.keys(aliasOperations)[0];
                        const aliasOperation = aliasOperations[aliasOperationName];
                        b[`${aliasOperationName}__alias__${aliasKey}: ${aliasOperationName}`] = traverseToSeekArrays([...parent, aliasOperationName], aliasOperation);
                    });
                }
                else {
                    b[k] = traverseToSeekArrays([...parent, k], a[k]);
                }
            });
        }
        else {
            return '';
        }
    }
    return objectToTree(b);
};
const buildQuery = (type, a) => traverseToSeekArrays([type], a);
const inspectVariables = (query) => {
    const regex = /\$\b\w*__ZEUS_VAR__\[?[^!^\]^\s^,^\)^\}]*[!]?[\]]?[!]?/g;
    let result;
    const AllVariables = [];
    while ((result = regex.exec(query))) {
        if (AllVariables.includes(result[0])) {
            continue;
        }
        AllVariables.push(result[0]);
    }
    if (!AllVariables.length) {
        return query;
    }
    let filteredQuery = query;
    AllVariables.forEach((variable) => {
        while (filteredQuery.includes(variable)) {
            filteredQuery = filteredQuery.replace(variable, variable.split('__ZEUS_VAR__')[0]);
        }
    });
    return `(${AllVariables.map((a) => a.split('__ZEUS_VAR__'))
        .map(([variableName, variableType]) => `${variableName}:${variableType}`)
        .join(', ')})${filteredQuery}`;
};
const queryConstruct = (t, tName, operationName) => (o) => `${t.toLowerCase()}${operationName ? ' ' + operationName : ''}${inspectVariables(buildQuery(tName, o))}`;
exports.queryConstruct = queryConstruct;
const fullChainConstruct = (fn) => (t, tName) => (o, options) => fn((0, exports.queryConstruct)(t, tName, options === null || options === void 0 ? void 0 : options.operationName)(o), options === null || options === void 0 ? void 0 : options.variables).then((r) => {
    seekForAliases(r);
    return r;
});
exports.fullChainConstruct = fullChainConstruct;
const fullSubscriptionConstruct = (fn) => (t, tName) => (o, options) => fn((0, exports.queryConstruct)(t, tName, options === null || options === void 0 ? void 0 : options.operationName)(o));
exports.fullSubscriptionConstruct = fullSubscriptionConstruct;
const seekForAliases = (response) => {
    const traverseAlias = (value) => {
        if (Array.isArray(value)) {
            value.forEach(seekForAliases);
        }
        else {
            if (typeof value === 'object') {
                seekForAliases(value);
            }
        }
    };
    if (typeof response === 'object' && response) {
        const keys = Object.keys(response);
        if (keys.length < 1) {
            return;
        }
        keys.forEach((k) => {
            const value = response[k];
            if (k.indexOf('__alias__') !== -1) {
                const [operation, alias] = k.split('__alias__');
                response[alias] = {
                    [operation]: value,
                };
                delete response[k];
            }
            traverseAlias(value);
        });
    }
};
const $ = (t) => `ZEUS_VAR$${t.join('')}`;
exports.$ = $;
const resolverFor = (type, field, fn) => fn;
exports.resolverFor = resolverFor;
const handleFetchResponse = (response) => {
    if (!response.ok) {
        return new Promise((_, reject) => {
            response.text().then(text => {
                try {
                    reject(JSON.parse(text));
                }
                catch (err) {
                    reject(text);
                }
            }).catch(reject);
        });
    }
    return response.json();
};
const apiFetch = (options) => (query, variables = {}) => {
    let fetchFunction = fetch;
    let queryString = query;
    let fetchOptions = options[1] || {};
    if (fetchOptions.method && fetchOptions.method === 'GET') {
        queryString = encodeURIComponent(query);
        return fetchFunction(`${options[0]}?query=${queryString}`, fetchOptions)
            .then(handleFetchResponse)
            .then((response) => {
            if (response.errors) {
                throw new GraphQLError(response);
            }
            return response.data;
        });
    }
    return fetchFunction(`${options[0]}`, Object.assign({ body: JSON.stringify({ query: queryString, variables }), method: 'POST', headers: {
            'Content-Type': 'application/json'
        } }, fetchOptions))
        .then(handleFetchResponse)
        .then((response) => {
        if (response.errors) {
            throw new GraphQLError(response);
        }
        return response.data;
    });
};
exports.apiFetch = apiFetch;
const apiSubscription = (options) => (query) => {
    var _a, _b, _c;
    try {
        const queryString = options[0] + '?query=' + encodeURIComponent(query);
        const wsString = queryString.replace('http', 'ws');
        const host = (options.length > 1 && ((_b = (_a = options[1]) === null || _a === void 0 ? void 0 : _a.websocket) === null || _b === void 0 ? void 0 : _b[0])) || wsString;
        const webSocketOptions = ((_c = options[1]) === null || _c === void 0 ? void 0 : _c.websocket) || [host];
        const ws = new WebSocket(...webSocketOptions);
        return {
            ws,
            on: (e) => {
                ws.onmessage = (event) => {
                    if (event.data) {
                        const parsed = JSON.parse(event.data);
                        const data = parsed.data;
                        if (data) {
                            seekForAliases(data);
                        }
                        return e(data);
                    }
                };
            },
            off: (e) => {
                ws.onclose = e;
            },
            error: (e) => {
                ws.onerror = e;
            },
            open: (e) => {
                ws.onopen = e;
            },
        };
    }
    catch (_d) {
        throw new Error('No websockets implemented');
    }
};
exports.apiSubscription = apiSubscription;
const allOperations = {
    "query": "Query"
};
const Thunder = (fn) => (operation) => (o, ops) => (0, exports.fullChainConstruct)(fn)(operation, allOperations[operation])(o, ops);
exports.Thunder = Thunder;
const Chain = (...options) => (0, exports.Thunder)((0, exports.apiFetch)(options));
exports.Chain = Chain;
const SubscriptionThunder = (fn) => (operation) => (o, ops) => (0, exports.fullSubscriptionConstruct)(fn)(operation, allOperations[operation])(o, ops);
exports.SubscriptionThunder = SubscriptionThunder;
const Subscription = (...options) => (0, exports.SubscriptionThunder)((0, exports.apiSubscription)(options));
exports.Subscription = Subscription;
const Zeus = (operation, o, operationName) => (0, exports.queryConstruct)(operation, allOperations[operation], operationName)(o);
exports.Zeus = Zeus;
const Selector = (key) => (0, exports.ZeusSelect)();
exports.Selector = Selector;
