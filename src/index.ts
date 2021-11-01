import "dotenv/config";
import { Agenda, Job } from "agenda";
import { MailService } from "./service/mail_serivce";

const mongoConnectionString = process.env.MONGO_URL!;

const agenda = new Agenda({ db: { address: mongoConnectionString } });

agenda.define("send email", async (job: Job) => {
  const { emails } = job.attrs.data!;
  for (const email of emails) {
    await MailService({ email });
  }
});

(async function () {
  await agenda.start();
  agenda.every("3 minute", "send email", {
    emails: ["email@email.com", "emal@emal.com"],
  });
})();
