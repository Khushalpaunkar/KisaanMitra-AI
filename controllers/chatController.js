const {askAgriBot} = require("../config/gemini");

const sendMessage = async (req, res) => {
    try {
        const {message} = req.body;
        if(!message || message.trim() === "") {
            return res.status(400).json({ success: false , message: "message is required"});
        }
        const answer = await askAgriBot(message);
        res.status(200).json({ success:true, answer: answer});
    }catch (error) {
        console.error(" chat Controller error:" , error);
        

        res.status(500).json({success: false , message: "Something went wrong with KissanMitra AI "});
    }
};

module.exports = {sendMessage};