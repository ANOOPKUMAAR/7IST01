
import type { Student, School, Program, Faculty } from './types';
import { mockFaculties } from './faculty-data';

const baseStudentDetails = {
    program: "Bachelor of Technology",
    branch: "Computer Science",
    department: "Data Science",
    section: "A",
    phone: "+1 (555) 123-4567",
    parentName: "Parent Name",
    address: "123 University Ave, College Town, USA",
};

const studentNames = [
    "Aarav Sharma", "Vivaan Singh", "Aditya Kumar", "Vihaan Patel", "Arjun Gupta", 
    "Sai Reddy", "Reyansh Joshi", "Ayaan Verma", "Krishna Mehta", "Ishaan Ali",
    "Saanvi Sharma", "Aanya Singh", "Aadhya Kumar", "Ananya Patel", "Diya Gupta",
    "Pari Reddy", "Myra Joshi", "Aarohi Verma", "Anika Mehta", "Navya Ali",
    "Rohan Desai", "Aryan Khan", "Advik Iyer", "Kabir Chatterjee", "Ansh Pandey",
    "Ishika Shah", "Prisha Reddy", "Zara Das", "Samaira Basu", "Kiara Menon",
    "Mohammed Rahman", "Yusuf Ahmed", "Fatima Begum", "Aisha Khanom", "Zainab Sultana",
    "Liam O'Sullivan", "Aoife Murphy", "Finn Kelly", "Ciara Walsh", "Niamh Byrne",
    "Alex Johnson", "Taylor Smith", "Jordan Williams", "Morgan Brown", "Casey Jones",
    "Dev Patel", "Rajesh Koothrappali", "Priya Kumar", "Sunita Sharma", "Anil Gupta",
    "Riya Chopra", "Amit Singh", "Deepika Reddy", "Vikram Rathore"
];

export const mockStudents: Student[] = Array.from({ length: 54 }, (_, index) => {
    const rollNo = `20221IST${(index + 1).toString().padStart(4, '0')}`;
    const name = studentNames[index % studentNames.length] + (index >= studentNames.length ? ` ${Math.floor(index / studentNames.length) + 1}` : '');
    return {
        ...baseStudentDetails,
        id: rollNo,
        name: name,
        rollNo: rollNo,
        deviceId: `dev_${rollNo}`,
        avatar: `https://picsum.photos/seed/${rollNo}/200`
    };
});


export const initialSchools: School[] = [
    { id: 'engineering', name: 'School of Engineering' },
    { id: 'business', name: 'School of Business' },
    { id: 'arts-sciences', name: 'School of Arts & Sciences' },
    { id: 'medicine', name: 'School of Medicine' },
    { id: 'law', name: 'School of Law' },
    { id: 'design', name: 'School of Design' },
];

export const initialProgramsBySchool: Record<string, Program[]> = {
    engineering: [
        { id: 'btech-cs', name: 'B.Tech in Computer Science', description: 'Focuses on software development and theoretical computer science.', departments: [
            {id: 'cs-ug', name: 'UG Computer Science', hod: 'Dr. Alan Turing', classes: [
                { id: 'cs101', name: 'Introduction to Programming', coordinator: 'Prof. Ada Lovelace', students: mockStudents, day: 'Monday', startTime: '09:00', endTime: '10:30', faculties: mockFaculties.slice(0,2), totalClasses: 20 },
                { id: 'cs201', name: 'Data Structures', coordinator: 'Prof. Niklaus Wirth', students: mockStudents, day: 'Wednesday', startTime: '11:00', endTime: '12:30', faculties: [mockFaculties[2]], totalClasses: 25 },
            ]},
            {id: 'cs-ai', name: 'Artificial Intelligence', hod: 'Dr. John McCarthy', classes: [
                { id: 'ai301', name: 'Intro to AI', coordinator: 'Prof. Geoffrey Hinton', students: mockStudents, day: 'Tuesday', startTime: '14:00', endTime: '15:30', faculties: [mockFaculties[3]], totalClasses: 18 },
                { id: 'ai401', name: 'Machine Learning', coordinator: 'Prof. Andrew Ng', students: mockStudents, day: 'Thursday', startTime: '10:00', endTime: '11:30', faculties: [mockFaculties[3], mockFaculties[4]], totalClasses: 22 },
            ]},
            {id: 'cs-cyber', name: 'Cybersecurity', hod: 'Dr. Kevin Mitnick', classes: [
                { id: 'cyb301', name: 'Network Security', coordinator: 'Prof. Ron Rivest', students: mockStudents, day: 'Friday', startTime: '13:00', endTime: '14:30', faculties: [], totalClasses: 15 },
            ]},
            {id: 'cs-ds', name: 'Data Science', hod: 'Dr. DJ Patil', classes: [
                 { id: 'ist', name: 'CSE1147', coordinator: 'Prof. Jeff Hammerbacher', students: mockStudents, day: 'Monday', startTime: '16:00', endTime: '17:30', faculties: [], totalClasses: 20 },
            ]},
        ] },
        { id: 'mtech-cs', name: 'M.Tech in Computer Science', description: 'Advanced studies in computer science and research.', departments: [{id: 'cs-pg', name: 'Postgraduate Computer Science', hod: 'Dr. Grace Hopper', classes: []}] },
        { id: 'btech-mech', name: 'B.Tech in Mechanical Engineering', description: 'Covers the design, construction, and use of machines.', departments: [
            {id: 'mech-ug', name: 'Undergraduate Mechanical Engineering', hod: 'Dr. James Watt', classes: []},
            {id: 'mech-robotics', name: 'Robotics', hod: 'Dr. Joseph Engelberger', classes: []},
            {id: 'mech-thermo', name: 'Thermal Engineering', hod: 'Dr. Sadi Carnot', classes: []},
        ] },
        { id: 'btech-elec', name: 'B.Tech in Electrical Engineering', description: 'Deals with electricity, electronics, and electromagnetism.', departments: [
            {id: 'elec-ug', name: 'Undergraduate Electrical Engineering', hod: 'Dr. Nikola Tesla', classes: []},
            {id: 'elec-vlsi', name: 'VLSI Design', hod: 'Dr. Gordon Moore', classes: []},
            {id: 'elec-power', name: 'Power Systems', hod: 'Dr. Edith Clarke', classes: []},
        ] },
        { id: 'btech-civil', name: 'B.Tech in Civil Engineering', description: 'Concerned with the design and construction of public works.', departments: [{id: 'civil-ug', name: 'Undergraduate Civil Engineering', hod: 'Dr. John Smeaton', classes: []}] },
    ],
    business: [
        { id: 'mba-fin', name: 'MBA in Finance', description: 'Prepares students for careers in financial management and analysis.', departments: [{id: 'fin-pg', name: 'Finance Department', hod: 'Dr. Eugene Fama', classes: []}] },
        { id: 'bba-mark', name: 'BBA in Marketing', description: 'Focuses on branding, advertising, and consumer behavior.', departments: [{id: 'mark-ug', name: 'Marketing Department', hod: 'Dr. Philip Kotler', classes: []}] },
        { id: 'mba-mgmt', name: 'MBA in Management', description: 'Covers leadership, organizational behavior, and strategic planning.', departments: [{id: 'mgmt-pg', name: 'Management Department', hod: 'Dr. Peter Drucker', classes: []}] },
    ],
    'arts-sciences': [
        { id: 'bsc-phy', name: 'B.Sc in Physics', description: 'Explores the fundamental principles of the universe.', departments: [{id: 'phy-ug', name: 'Physics Department', hod: 'Dr. Albert Einstein', classes: []}]},
        { id: 'ba-hist', name: 'B.A. in History', description: 'The study of past events, particularly in human affairs.', departments: [{id: 'hist-ug', name: 'History Department', hod: 'Dr. Herodotus', classes: []}]},
        { id: 'ma-eng', name: 'M.A. in English Literature', description: 'Analyzes literary works in the English language.', departments: [{id: 'eng-pg', name: 'English Department', hod: 'Dr. William Shakespeare', classes: []}]},
    ],
    medicine: [
        { id: 'mbbs', name: 'MBBS', description: 'Prepares students for medical school.', departments: [{id: 'med-ug', name: 'General Medicine', hod: 'Dr. Hippocrates', classes: []}]},
        { id: 'bsc-nur', name: 'B.Sc. in Nursing', description: 'Focuses on patient care and health promotion.', departments: [{id: 'nur-ug', name: 'Nursing Department', hod: 'Dr. Florence Nightingale', classes: []}]},
        { id: 'mph', name: 'Master of Public Health', description: 'Concerned with protecting and improving the health of communities.', departments: [{id: 'ph-pg', name: 'Public Health Department', hod: 'Dr. John Snow', classes: []}]},
    ],
    law: [
        { id: 'jd', name: 'Juris Doctor (JD)', description: 'The primary professional degree for lawyers.', departments: [{id: 'law-jd', name: 'Jurisprudence', hod: 'Dr. John Austin', classes: []}]},
        { id: 'para', name: 'Paralegal Studies', description: 'Trains students to assist lawyers in their legal work.', departments: [{id: 'law-para', name: 'Paralegal Department', hod: 'Dr. Erin Brockovich', classes: []}]},
    ],
    design: [
        { id: 'bdes-graph', name: 'B.Des in Graphic Design', description: 'Focuses on visual communication and problem-solving.', departments: [{id: 'graph-ug', name: 'Graphic Design', hod: 'Dr. Paul Rand', classes: []}]},
        { id: 'bdes-indus', name: 'B.Des in Industrial Design', description: 'The design of mass-produced products.', departments: [{id: 'indus-ug', name: 'Industrial Design', hod: 'Dr. Dieter Rams', classes: []}]},
        { id: 'bdes-fash', name: 'B.Des in Fashion Design', description: 'The art of applying design and aesthetics to clothing.', departments: [{id: 'fash-ug', name: 'Fashion Design', hod: 'Dr. Coco Chanel', classes: []}]},
    ],
};

    
