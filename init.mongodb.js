use('blogDB');

// Clean up
db.users.drop();
db.entries.drop();

// Indexes
db.users.createIndex({ username: 1 }, { unique: true });
db.entries.createIndex({ title: 1, 'author.username': 1 }, { unique: true });

// 5 users
db.users.insertMany([
  { username: 'admin', name: { firstname: 'Admin', lastname: 'Boss' }, email: 'admin@blog.com', password: 'pwd' },
  { username: 'john_doe', name: { firstname: 'John', lastname: 'Doe' }, email: 'john@blog.com', password: 'pwd' },
  { username: 'jane_smith', name: { firstname: 'Jane', lastname: 'Smith' }, email: 'jane@blog.com', password: 'pwd' },
  { username: 'tech_guru', name: { firstname: 'Tech', lastname: 'Guru' }, email: 'tech@blog.com', password: 'pwd' },
  { username: 'Guest', name: { firstname: 'Guest', lastname: 'User' }, email: 'guest@blog.com', password: 'pwd' }
]);

// Dates
var nowMs = new Date().getTime();
var tenDaysAgo = new Date(nowMs - 10 * 24 * 60 * 60 * 1000);
var fiveDaysAgo = new Date(nowMs - 5 * 24 * 60 * 60 * 1000);
var twoDaysAgo = new Date(nowMs - 2 * 24 * 60 * 60 * 1000);

// Base64 Dummy 
var base64Img1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=";
var base64Img2 = base64Img1;

// 5 blog-entries
db.entries.insertMany([
  {
    title: "My first programming post",
    author: { username: "admin", name: "Admin Boss" },
    description: "A post about programming.",
    creationDate: tenDaysAgo,
    editDates: [],
    impressionCount: 1500,
    content: {
      text: "Here is a cool link: https://google.com and an image.",
      links: ["https://google.com"],
      images: [base64Img1],
      additionalField: "Some extra data"
    },
    commentsAllowed: true,
    category: "Programming",
    comments: []
  },
  {
    title: "Database Performance Tuning",
    author: { username: "john_doe", name: "John Doe" },
    description: "Improving MongoDB queries.",
    creationDate: new Date(),
    editDates: [new Date()],
    impressionCount: 300,
    content: {
      text: "Make sure you use indexes. Database Performance Tuning is key. Here are two images.",
      links: [],
      images: [base64Img1, base64Img2],
      additionalField: "Expert level"
    },
    commentsAllowed: true,
    category: "Database",
    comments: []
  },
  {
    title: "A simple life update",
    author: { username: "jane_smith", name: "Jane Smith" },
    description: "What I have been up to.",
    creationDate: twoDaysAgo,
    editDates: [],
    impressionCount: 50,
    content: {
      text: "Just enjoying the warm weather and reading.",
      links: [],
      images: [],
      additionalField: null
    },
    commentsAllowed: true,
    category: "Lifestyle",
    comments: []
  },
  {
    title: "Why AI will rule the world",
    author: { username: "tech_guru", name: "Tech Guru" },
    description: "Insights into AI agents.",
    creationDate: fiveDaysAgo,
    editDates: [],
    impressionCount: 88,
    content: {
      text: "AI is growing exponentially. Check https://openai.com",
      links: ["https://openai.com"],
      images: [base64Img2]
    },
    commentsAllowed: false,
    category: "Programming",
    comments: []
  },
  {
    title: "Learning Docker",
    author: { username: "admin", name: "Admin Boss" },
    description: "It is so easy to start MongoDB.",
    creationDate: new Date(),
    editDates: [],
    impressionCount: 15,
    content: {
      text: "Learning Docker is fun and practical.",
      links: [],
      images: [],
      additionalField: "Container magic"
    },
    commentsAllowed: true,
    category: "DevOps",
    comments: []
  }
]);

// 4 comments to 3 different blog-entries

// Entry 1 gets 2 comments
db.entries.updateOne(
  { title: "My first programming post" },
  {
    $push: {
      comments: {
        $each: [
          { text: "Great post!", author: "john_doe", date: new Date() },
          { text: "I agree, very helpful.", author: "jane_smith", date: new Date() }
        ]
      }
    }
  }
);

// Entry 2 gets 1 comment
db.entries.updateOne(
  { title: "Database Performance Tuning" },
  { $push: { comments: { text: "Indexes are a lifesaver.", author: "admin", date: new Date() } } }
);

// Entry 3 gets 1 comment
db.entries.updateOne(
  { title: "A simple life update" },
  { $push: { comments: { text: "Nice update, keep it up!", author: "tech_guru", date: new Date() } } }
);

print("Database initialization completed successfully!");
