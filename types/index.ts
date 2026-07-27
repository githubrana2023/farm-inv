/**
 * Maps a set of keys to a set of actions.
 *
 * Each key contains all possible actions, where the value is
 * a template literal string in the format `${Key}_${Action}`.
 *
 * @typeParam Key - Union of keys.
 * @typeParam Action - Union of actions.
 *
 * @example
 * type Keys = "USER" | "ORDER";
 * type Actions = "CREATE" | "DELETE";
 *
 * type Result = KeyActionMap<Keys, Actions>;
 *
 *  const keys :Result= {
 *    USER: {
 *      CREATE: "USER_CREATE";
 *      DELETE: "USER_DELETE";
 *    };
 *    ORDER: {
 *      CREATE: "ORDER_CREATE";
 *      DELETE: "ORDER_DELETE";
 *    };
 *  }
 */
export type KeyActionMap<Key extends string, Action extends string> = {
    [K in Key]: {
        [A in Action]: `${K}_${A}`
    }
}

/**
 * Maps a set of keys to a set of actions.
 *
 * Each key contains all possible actions, where the value is
 * a template literal string in the format `${Key}_${Action}`.
 *
 * @typeParam Key - Union of keys.
 * @typeParam Prefix - constant value
 *
 * @example
 * type Prefix = "PREFIX"
 * type Keys = "USER" | "ORDER";
 *
 * type Result = AsyncStorageKeyMap<Keys, Prefix>;
 *
 *  const keys :Result= {
 *    USER: 'PREFIX_USER'
 *    ORDER:'PREFIX_ORDER'
 *  }
 */
export type AsyncStorageKeyMap<Key extends string, Prefix extends string> = {
    [K in Key]: `${Prefix}_${K}`
}

