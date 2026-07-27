export default {
    features: {
        auth: true,
    },
    variables: [
        { name: 'user', value: 'user', type: 'object', defaultValue: null },
        { name: 'accessToken', value: 'token', type: 'accessToken', defaultValue: null },
        { name: 'isAuthenticated', value: 'isAuthenticated', type: 'boolean', defaultValue: false },
    ],
    actions: [
        {
            name: 'Login with Popup',
            code: 'loginWithPopup',
            isAsync: true,
        },
        {
            name: 'Login with Redirect',
            code: 'loginWithRedirect',
        },
        { name: 'Logout', code: 'logout' },
        {
            name: 'Update User Profile',
            code: 'updateUserProfile',
            isAsync: true,
        },
        {
            name: 'Update User Email',
            code: 'updateUserEmail',
            isAsync: true,
        },
        {
            name: 'Change User Password',
            code: 'changeUserPassword',
            isAsync: true,
        },
    ],
};
