const models = require('../models')
const generateID = async (req, requireAuth = true) => {
    const char = await models.UniqueNumber.findOne({
        where:{
             char : req.char
        }
    });

    // console.log('ini char', char)

    if (!char){
        const newNumber = await models.UniqueNumber.create({
            char : req.char,
            value : 1
        });        
        return newNumber.char+'/1'
    }else{
        let value = char.dataValues.value+1;
        console.log(value, 'ini incremenet');
        const updateNumber = await models.UniqueNumber.update({value : value}, {where: {id:char.id}})
        if (updateNumber){
            return char.dataValues.char+'/'+value
        }
    }

    return null
}
module.exports = { generateID }