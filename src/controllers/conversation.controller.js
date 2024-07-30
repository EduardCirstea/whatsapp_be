import createHttpError from "http-errors";
import logger from "../configs/logger.config.js";
import {
  doesConversationExist,
  createConversation,
  populateConversation,
  getUserConversations,
} from "../services/conversation.service.js";
import { findUser } from "../services/user.services.js";
export const create_open_conversation = async (req, res, next) => {
  try {
    const sender_id = req.user.userId;
    const { receiver_id } = req.body;
    console.log(sender_id, receiver_id);
    //check if receiver_id is provided
    if (!receiver_id) {
      logger.error(
        "Please provide the user id you wanna start a conversation with!"
      );
      throw createHttpError.BadGateway("Oops ...Something went wrong!");
    }
    //check if chat exists
    const existed_conversation = await doesConversationExist(
      sender_id,
      receiver_id
    );
    if (existed_conversation) {
      res.json(existed_conversation);
    } else {
      let receiver_user = await findUser(receiver_id);
      let convoData = {
        name: receiver_user.name,
        isGroup: false,
        users: [sender_id, receiver_id],
      };
      console.log(convoData);
      const newConvo = await createConversation(convoData);
      const populatedConvo = await populateConversation(
        newConvo._id,
        "users",
        "-password"
      );
      res.status(200).json(populatedConvo);
    }
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const conversations = await getUserConversations(user_id);
    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};
