let grantObjects = {
  reader: {
          posts: {
              'read:any': ['*', '!id']
          },
          users: {
            'read:any': ['*', '!id', '!birthday']
          }
      },
      writer: {
          posts: {
              'create:own': ['*'],
              'read:any': ['*'],
              'update:own': ['*'],
              'delete:own': ['*']
          },
          users: {
            'create:own': ['*'],
            'read:any': ['*'],
            'update:own': ['*'],
            'delete:own': ['*']
          }
      },
      editor: {
          posts: {
              'create:any': ['*'],
              'read:any': ['*'],
              'update:any': ['*'],
              'delete:any': ['*']
          },
          users: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
          }
      }
  }
  

  module.exports = {
    checkPermissions(AccessControl, app, objs) {
      const ac = new AccessControl(grantObjects);
      app.get('/posts/:title', function (req, res, next) {

        console.log('')
        console.log('')
        console.log(`================================== PERMISSION CONTROL USING OBJECTS =================================`)

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
  
        console.log(`================================== PERMISSION CONTROL USING OBJECTS =================================`)
        console.log('')
        console.log('')
        return next()
      });
    }
  }