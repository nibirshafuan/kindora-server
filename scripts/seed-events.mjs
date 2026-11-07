import { MongoClient } from "mongodb";
import { setServers } from "node:dns";
import dotenv from "dotenv";

dotenv.config();
setServers(["1.1.1.1", "8.8.8.8"]);

const uri = process.env.MONGODB_URI;
const databaseName = process.env.DATABASE_NAME || "kindora";

if (!uri) {
  throw new Error("MONGODB_URI is missing.");
}

const client = new MongoClient(uri);

const sampleEvents = [
  {
    title: "Kindora Tree Plantation Campaign",
    description:
      "Join our community tree plantation campaign and help create a greener, healthier environment. Volunteers will plant trees, learn about environmental protection, and work together for a sustainable future.",
    eventType: "Environment",
    imageUrl:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200",
    location: "Daffodil International University, Dhaka",
    eventDate: new Date("2026-11-19T09:00:00+06:00"),
  },
  {
    title: "Community Blood Donation Camp",
    description:
      "Be a hero by donating blood and helping save lives. This community initiative brings volunteers together to support patients who urgently need blood.",
    eventType: "Healthcare",
    imageUrl:
      "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1200",
    location: "Daffodil International University, Dhaka",
    eventDate: new Date("2026-11-21T10:00:00+06:00"),
  },
  {
    title: "Kindora Food Distribution Program",
    description:
      "Help distribute nutritious meals to underprivileged families. Volunteers will organize food packages and spread kindness through meaningful community service.",
    eventType: "Charity",
    imageUrl:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200",
    location: "Dhanmondi, Dhaka",
    eventDate: new Date("2026-11-23T09:30:00+06:00"),
  },
  {
    title: "Free Educational Skills Workshop",
    description:
      "Participate in a free educational workshop focused on digital literacy, communication, and essential career skills. Open to students and young learners.",
    eventType: "Education",
    imageUrl:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200",
    location: "Daffodil International University, Dhaka",
    eventDate: new Date("2026-11-25T11:00:00+06:00"),
  },
  {
    title: "Community Health Awareness Day",
    description:
      "Take part in a community health awareness program featuring health education, wellness guidance, and discussions about healthy living.",
    eventType: "Healthcare",
    imageUrl:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200",
    location: "Mirpur, Dhaka",
    eventDate: new Date("2026-11-27T10:00:00+06:00"),
  },
];

async function seedEvents() {
  try {
    await client.connect();

    const db = client.db(databaseName);
    const events = db.collection("events");

    const existingEvent = await events.findOne({
      title: "Kindora Community Cleanup",
    });

    if (!existingEvent?.creatorEmail) {
      throw new Error(
        "Existing Kindora Community Cleanup event or creatorEmail not found. No data inserted."
      );
    }

    const creatorEmail = existingEvent.creatorEmail;
    const now = new Date();

    let inserted = 0;
    let skipped = 0;

    for (const event of sampleEvents) {
      const alreadyExists = await events.findOne({
        title: event.title,
        creatorEmail,
      });

      if (alreadyExists) {
        console.log(`Skipped existing event: ${event.title}`);
        skipped++;
        continue;
      }

      if (event.eventDate <= now) {
        console.log(`Skipped past event: ${event.title}`);
        skipped++;
        continue;
      }

      await events.insertOne({
        ...event,
        creatorEmail,
        createdAt: now,
        updatedAt: now,
      });

      console.log(`Inserted: ${event.title}`);
      inserted++;
    }

    console.log("\n========== SEED SUMMARY ==========");
    console.log(`Inserted: ${inserted}`);
    console.log(`Skipped: ${skipped}`);

    const total = await events.countDocuments({
      eventDate: { $gt: new Date() },
    });

    console.log(`Total upcoming events in database: ${total}`);
    console.log("==================================");
  } finally {
    await client.close();
  }
}

seedEvents().catch((error) => {
  console.error("Event seeding failed:", error.message);
  process.exitCode = 1;
});
