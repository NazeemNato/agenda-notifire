import { Notifire, ChannelTypeEnum } from "@notifire/core";
import { NodemailerProvider } from "@notifire/nodemailer";
import { template } from "./template";
import moment from "moment";

type mail = {
  email: string;
};

export const MailService = async (mail: mail) => {
  try {
    const notifire = new Notifire();
    await notifire.registerProvider(
      new NodemailerProvider({
        from: process.env.MAIL!,
        host: process.env.MAIL_SMTP_HOST!,
        port: 465,
        secure: true,
        user: process.env.MAIL!,
        password: process.env.MAIL_PASSWORD!,
      })
    );
    const time = moment().format("h:mm:ss a");
    const subject = `🕐 ${time} Agenda`;
    await notifire.registerTemplate({
      id: "greeting-mail",
      messages: [
        {
          subject,
          channel: ChannelTypeEnum.EMAIL,
          template: template(time),
        },
      ],
    });
    await notifire.trigger("greeting-mail", {
      $user_id: `${mail.email}-${new Date().toISOString}`,
      $email: mail.email,
    });
    console.log("Done!")
  } catch (e) {
    console.log(e);
  }
};
