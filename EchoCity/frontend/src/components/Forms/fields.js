const signupFields = [
    {name: 'username', type: 'text', label: 'Username', placeholder: 'Username', required: true},
    {name: 'email', type: 'email', label: 'Email', placeholder: 'Email', required: true},
    {name: 'password', type: 'password', label: 'Password', placeholder: 'Password', required: true},
    {name: 'firstName', type: 'text', label: 'First Name', placeholder: 'First Name', required: true},
    {name: 'lastName', type: 'text', label: 'Last name', placeholder: 'Last Name', required: true},
    {name: 'city', type: 'text', label: 'City', placeholder: 'City', required: true},
    {name: 'state', type: 'text', label: 'State', placeholder: 'State', required: true},
]

const loginFields = [
    { name: 'email', type: 'email', label: 'Email', placeholder: 'Email', required: true },
    { name: 'password', type: 'password', label: 'Password', placeholder: 'Password', required: true}
  ]


export {
    signupFields,
    loginFields
}