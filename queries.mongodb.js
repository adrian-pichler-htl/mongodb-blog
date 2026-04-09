// ========= Task 3: QUERIES =========
use('blogDB');

// 1. all blog-users where username & password match given values.
db.users.find(
    { username: "admin", password: "pwd" }
);

// 2. all blog-entries being written by a certain blog-user (username).
db.entries.find(
    { "author.username": "admin" }
);

// 3. all blog-entries that does not contain ANY information in one of your additional fields.
db.entries.find({
    $or: [
        { "content.additionalField": { $exists: false } },
        { "content.additionalField": null }
    ]
});

// 4. all blog-entries where the entry has more than 1 image.
db.entries.find(
    { "content.images.1": { $exists: true } }
);

// 5 & 6. all blog-entries where the entry contains image(s) and
// whose author either has a given lastname ('Doe') or has the value 'admin' but not 'Guest'.
db.entries.find({
    "content.images.0": { $exists: true },
    $and: [
        { "author.username": { $ne: "Guest" } },
        {
            $or: [
                { "author.name": /Doe$/ },
                { "author.username": "admin" }
            ]
        }
    ]
});

// 7. all blog-entries where the title is mentioned in the content as well.
db.entries.find({
    $expr: {
        $ne: [{ $indexOfCP: ["$content.text", "$title"] }, -1]
    }
});

// 8. all BlogUser sorted ascending by username.
db.users.find().sort({ username: 1 });

// 9. the newest (creationDate) 2 blog-entries.
db.entries.find().sort({ creationDate: -1 }).limit(2);

// 10. the second oldest blog-entry.
db.entries.find().sort({ creationDate: 1 }).skip(1).limit(1);

// 11. all blog-entries created within the last week containing a link.
var oneWeekAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
db.entries.find({
    creationDate: { $gte: oneWeekAgo },
    "content.links.0": { $exists: true }
});

// 12. the 2 newest blog-comments added to a given username's entries.
db.entries.aggregate([
    { $match: { "author.username": "admin" } },
    { $unwind: "$comments" },
    { $sort: { "comments.date": -1 } },
    { $limit: 2 },
    { $project: { _id: 0, comment: "$comments", entryTitle: "$title" } }
]);


// ========= Task 4: CHANGES =========

// 1. Add a new author to an existing blog-entry or change the author
db.entries.updateOne(
    { title: "My first programming post" },
    { $set: { author: { username: "tech_guru", name: "Tech Guru" } } }
);

// 2. Extend the newest blog-entry by an additional field 'hashtag' with content.
var newestEntry = db.entries.find().sort({ creationDate: -1 }).limit(1).toArray()[0];
if (newestEntry) {
    db.entries.updateOne(
        { _id: newestEntry._id },
        { $set: { hashtag: "#assignment" } }
    );
}

// 3. Change the name of a blog-category.
db.entries.updateMany(
    { category: "Programming" },
    { $set: { category: "Software Development" } }
);

// 4. Add a blog-entry, if the entry already exists it should only be changed (upsert).
db.entries.updateOne(
    { title: "Upserted Title", "author.username": "admin" },
    {
        $set: {
            title: "Upserted Title",
            author: { username: "admin", name: "Admin Boss" },
            description: "Ein Eintrag, der ge-upserted wurde.",
            content: { text: "Dieser Content wurde neu erstellt oder ge-updatet", links: [], images: [] }
        },
        $setOnInsert: {
            creationDate: new Date(),
            impressionCount: 0,
            commentsAllowed: true,
            category: "Neuigkeiten",
            comments: []
        }
    },
    { upsert: true }
);

// 5. Delete a blog-entry and its comments.
db.entries.deleteOne(
    { title: "A simple life update" }
);
