const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load models
const Notice = require('./models/Notice');
const Testimonial = require('./models/Testimonial');
const User = require('./models/User');

const noticeSlides = [
  {
    title: "Admissions Open 2026-27",
    description: "New applications are open for the session 2026-27",
    link: "/pages/admission",
    buttonText: "Apply Now",
  },
  {
    title: "H. P. Bansal Memorial Sports Meet 2026",
    description: "25 & 26 February 2026 - Give your names to your respective HODs",
    link: "tel:+91 9568775222",
    buttonText: "Contact now",
  }
];

const testimonials = [
  {
    content: "The faculty here goes above and beyond to ensure we understand complex concepts. Their practical teaching approach has prepared me exceptionally well for my career.",
    author: "Anjali Tiwari",
    role: "BTECH(CSE) 2023-27",
  },
  {
    content: "The faculty doesn't just teach subjects; they mentor us for life. Their guidance helped me discover my true potential and career path.",
    author: "Taniya Pundir",
    role: "BTECH(CSE) 2023-27",
  },
  {
    content: "The teachers are truly approachable. Even the toughest subjects felt manageable because of their constant guidance.",
    author: "Sakshi Pundir",
    role: "BTECH(CSE) 2024-28",
  },
  {
    content: "From advanced labs to interactive workshops, the exposure I received shaped my understanding of how industries actually work.”",
    author: "Himanshu Sharma",
    role: "BTECH(CSE) 2023-27",
  },
  {
    content: "“I learned to think creatively and solve problems rather than just memorize theories. That mindset changed everything for me.”",
    author: "Mahima Saini",
    role: "BTECH(CSE) 2023-27",
  },
  {
    content: "“The campus feels like a second home. The friendships, faculty support, and opportunities here shaped my entire college journey.”",
    author: "Digvijay Singh Pundir",
    role: "BTECH(CSE) 2023-27",
  },
  {
    content: "“Joining this institute was the turning point of my academic life. Every day here motivates me to aim higher and become better.”",
    author: "Aakarshi Vashishtha",
    role: "BTECH(CSE) 2023-27",
  },
  {
    content: "The industry visits and guest lectures from professionals gave us real-world insights that textbooks alone can't provide. This exposure was crucial for my career decisions.”",
    author: "Yasar Arif",
    role: "BTECH(EEE) 2023-27",
  },
  {
    content: "“The cultural clubs here gave me a space to express myself. Whether it was dance, poetry, or open-mic nights, I finally felt seen.”",
    author: "Lakshay Kamboj",
    role: "BTECH(CSE) 2024-28",
  },
  {
    content: "“The photography club allowed me to explore my creative side. Capturing campus life became my favorite escape from everyday stress.”",
    author: "Lavish Chaudhary",
    role: "BBA 2022-25",
  },
  {
    content: "“The annual music nights helped me overcome my stage fear. Performing in front of such a supportive crowd felt magical.”",
    author: "Saksham Sharma",
    role: "BBA 2022-2025",
  }
];

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
  try {
    await Notice.deleteMany();
    await Testimonial.deleteMany();
    await User.deleteMany();

    await Notice.insertMany(noticeSlides);
    await Testimonial.insertMany(testimonials);

    // Create Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      username: 'admin',
      email: 'admin@dbgi.in',
      password: hashedPassword,
      role: 'SuperAdmin'
    });

    console.log('Data Imported!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Notice.deleteMany();
    await Testimonial.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
