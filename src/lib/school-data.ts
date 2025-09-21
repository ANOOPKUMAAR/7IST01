import type { Student, School, Program, Faculty } from './types';
import { mockFaculties } from './faculty-data';

const baseStudentDetails = {
    program: "Bachelor of Technology",
    branch: "Computer Science",
    department: "Engineering",
    section: "A",
    phone: "+1 (555) 123-4567",
    parentName: "Parent Name",
    address: "123 University Ave, College Town, USA",
};

export const mockStudents: Student[] = [
    { ...baseStudentDetails, id: '20221IST0001', name: 'Aditya Sharma', rollNo: '20221IST0001', deviceId: 'dev_user', avatar: `https://picsum.photos/seed/s0/200` },
    { ...baseStudentDetails, id: '20221IST0002', name: 'Priya Singh', rollNo: '20221IST0002', deviceId: 'dev_abc123', avatar: `https://picsum.photos/seed/s1/200` },
    { ...baseStudentDetails, id: '20221IST0003', name: 'Rohan Gupta', rollNo: '20221IST0003', deviceId: 'dev_def456', avatar: `https://picsum.photos/seed/s2/200` },
    { ...baseStudentDetails, id: '20221IST0004', name: 'Sneha Patel', rollNo: '20221IST0004', deviceId: 'dev_ghi789', avatar: `https://picsum.photos/seed/s3/200` },
    { ...baseStudentDetails, id: '20221IST0005', name: 'Vikram Reddy', rollNo: '20221IST0005', deviceId: 'dev_jkl012', avatar: `https://picsum.photos/seed/s4/200` },
    { ...baseStudentDetails, id: '20221IST0006', name: 'Anjali Desai', rollNo: '20221IST0006', deviceId: 'dev_mno345', avatar: `https://picsum.photos/seed/s5/200` },
    { ...baseStudentDetails, id: '20221IST0007', name: 'Karan Kumar', rollNo: '20221IST0007', deviceId: 'dev_pqr678', avatar: `https://picsum.photos/seed/s6/200` },
    { ...baseStudentDetails, id: '20221IST0008', name: 'Neha Joshi', rollNo: '20221IST0008', deviceId: 'dev_stu901', avatar: `https://picsum.photos/seed/s7/200` },
    { ...baseStudentDetails, id: '20221IST0009', name: 'Sameer Verma', rollNo: '20221IST0009', deviceId: 'dev_vwx234', avatar: `https://picsum.photos/seed/s8/200` },
    { ...baseStudentDetails, id: '20221IST0010', name: 'Pooja Mehta', rollNo: '20221IST0010', deviceId: 'dev_yza567', avatar: `https://picsum.photos/seed/s9/200` },
    { ...baseStudentDetails, id: '20221IST0011', name: 'Arjun Nair', rollNo: '20221IST0011', deviceId: 'dev_bcd890', avatar: `https://picsum.photos/seed/s10/200` },
    { ...baseStudentDetails, id: '20221IST0012', name: 'Divya Iyer', rollNo: '20221IST0012', deviceId: 'dev_efg123', avatar: `https://picsum.photos/seed/s11/200` },
    { ...baseStudentDetails, id: '20221IST0013', name: 'Harish Singhania', rollNo: '20221IST0013', deviceId: 'dev_hij456', avatar: `https://picsum.photos/seed/s12/200` },
    { ...baseStudentDetails, id: '20221IST0014', name: 'Ishita Chatterjee', rollNo: '20221IST0014', deviceId: 'dev_klm789', avatar: `https://picsum.photos/seed/s13/200` },
    { ...baseStudentDetails, id: '20221IST0015', name: 'Manish Pandey', rollNo: '20221IST0015', deviceId: 'dev_nop012', avatar: `https://picsum.photos/seed/s14/200` },
];


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
                { id: 'cs101', name: 'Introduction to Programming', coordinator: 'Prof. Ada Lovelace', students: mockStudents.slice(0, 2), day: 'Monday', startTime: '09:00', endTime: '10:30', faculties: mockFaculties.slice(0,2) },
                { id: 'cs201', name: 'Data Structures', coordinator: 'Prof. Niklaus Wirth', students: mockStudents.slice(2, 5), day: 'Wednesday', startTime: '11:00', endTime: '12:30', faculties: [mockFaculties[2]] },
            ]},
            {id: 'cs-ai', name: 'Artificial Intelligence', hod: 'Dr. John McCarthy', classes: [
                { id: 'ai301', name: 'Intro to AI', coordinator: 'Prof. Geoffrey Hinton', students: mockStudents.slice(1, 3), day: 'Tuesday', startTime: '14:00', endTime: '15:30', faculties: [] },
                { id: 'ai401', name: 'Machine Learning', coordinator: 'Prof. Andrew Ng', students: mockStudents.slice(0, 4), day: 'Thursday', startTime: '10:00', endTime: '11:30', faculties: [mockFaculties[4]] },
            ]},
            {id: 'cs-cyber', name: 'Cybersecurity', hod: 'Dr. Kevin Mitnick', classes: [
                { id: 'cyb301', name: 'Network Security', coordinator: 'Prof. Ron Rivest', students: mockStudents.slice(3, 5), day: 'Friday', startTime: '13:00', endTime: '14:30', faculties: [] },
            ]},
            {id: 'cs-ds', name: 'Data Science', hod: 'Dr. DJ Patil', classes: [
                 { id: 'ds301', name: '7IST01', coordinator: 'Prof. Jeff Hammerbacher', students: mockStudents.slice(0, 15), day: 'Monday', startTime: '16:00', endTime: '17:30', faculties: [mockFaculties[3]] },
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
