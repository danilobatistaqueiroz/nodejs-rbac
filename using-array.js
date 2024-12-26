let grantArray = [
  { role: 'reader', resource: 'posts', action: 'read:any', attributes: ['*', '!id'] },

  { role: 'writer', resource: 'posts', action: 'read:any', attributes: '*' },
  { role: 'writer', resource: 'posts', action: 'create:own', attributes: '*' },
  { role: 'writer', resource: 'posts', action: 'update:own', attributes: '*' },
  { role: 'writer', resource: 'posts', action: 'delete:own', attributes: '*' },

  { role: 'editor', resource: 'posts', action: 'read:any', attributes: '*' },
  { role: 'editor', resource: 'posts', action: 'create:any', attributes: '*' },
  { role: 'editor', resource: 'posts', action: 'update:any', attributes: '*' },
  { role: 'editor', resource: 'posts', action: 'delete:any', attributes: '*' },

  { role: 'reader', resource: 'users', action: 'read:any', attributes: 'name' },
  { role: 'reader', resource: 'users', action: 'update:own', attributes: ['*', '!id', '!email'] },

  { role: 'writer', resource: 'users', action: 'read:any', attributes: 'name' },
  { role: 'writer', resource: 'users', action: 'update:own', attributes: ['*', '!id', '!email'] },

  { role: 'editor', resource: 'users', action: 'read:any', attributes: '*' },
  { role: 'editor', resource: 'users', action: 'update:any', attributes: 'ranking' },
]


module.exports = {
  checkPermissions(AccessControl, app, objs) {
    const ac = new AccessControl(grantArray);
    app.get('/posts/:title', function (req, res, next) {

      console.log('')
      console.log('')
      console.log(`================================== PERMISSION CONTROL USING ARRAY =================================`)

      const entities = req.headers.entities
      console.log(`post ${req.params.title}`)

      operations = ['readAny','createAny','updateAny','deleteAny','readOwn','createOwn','updateOwn','deleteOwn']
      operations.forEach((operation)=>{
        permission = ac.can(req.headers.role)[operation](entities);
        if (permission.granted) {
          console.log(`permission is granted to ${req.headers.role} for ${operation} ${entities}`);
          console.log('attributes:',permission.attributes)
          objs[entities].forEach(obj => {
            if(permission.attributes.includes('*')) {
              const excludedAttributes = permission.attributes.filter(a => a[0]=='!').map(a => a.substring(1, a.length));
              console.log('excluded attributes:',excludedAttributes)
              Object.keys(obj).forEach(key => {
                if(!excludedAttributes.includes(key)) {
                  console.log('\t',key,'\t',obj[key])
                }
              });
            } else {
              permission.attributes.forEach(attribute => {
                console.log('\t',attribute,'\t',obj[attribute])
              })
            }
          })
        } else {
          fault(`permission is denied to ${req.headers.role} for ${operation} ${entities}`);
        }
      })

      console.log(`================================== PERMISSION CONTROL USING ARRAY =================================`)
      console.log('')
      console.log('')

      return next()
    });
  }
}