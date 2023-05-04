const UserModal = require('./../Modals/userSchema')

exports.signup = async(req,res,next)=>{
    try{
        const doc = await UserModal.create({
            email:req.body.email,
            password:req.body.password,
            passwordConfirm:req.body.passwordConfirm
        })
        console.log(doc)
        res.status(200).json({
            msg:'success',
            data:{doc}
        })
    }catch{
        res.status(500).json({
            data:[],
            msg:'error'
        })
    }
}