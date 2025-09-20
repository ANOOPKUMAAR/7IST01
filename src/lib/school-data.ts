
export const schools = [
    { id: 'engineering', name: 'School of Engineering', icon: 'School' },
    { id: 'business', name: 'School of Business', icon: 'School' },
    { id: 'arts-sciences', name: 'School of Arts & Sciences', icon: 'School' },
    { id: 'medicine', name: 'School of Medicine', icon: 'School' },
    { id: 'law', name: 'School of Law', icon: 'School' },
    { id: 'design', name: 'School of Design', icon: 'School' },
];

export const programsBySchool: Record<string, {name: string, description: string}[]> = {
    engineering: [
        { name: 'Computer Science', description: 'Focuses on software development and theoretical computer science.' },
        { name: 'Mechanical Engineering', description: 'Covers the design, construction, and use of machines.' },
        { name: 'Electrical Engineering', description: 'Deals with electricity, electronics, and electromagnetism.' },
        { name: 'Civil Engineering', description: 'Concerned with the design and construction of public works.' },
    ],
    business: [
        { name: 'Finance', description: 'Prepares students for careers in financial management and analysis.' },
        { name: 'Marketing', description: 'Focuses on branding, advertising, and consumer behavior.' },
        { name: 'Management', description: 'Covers leadership, organizational behavior, and strategic planning.' },
    ],
    'arts-sciences': [
        { name: 'Physics', description: 'Explores the fundamental principles of the universe.' },
        { name: 'History', description: 'The study of past events, particularly in human affairs.' },
        { name: 'English Literature', description: 'Analyzes literary works in the English language.' },
    ],
    medicine: [
        { name: 'Pre-Medical Studies', description: 'Prepares students for medical school.' },
        { name: 'Nursing', description: 'Focuses on patient care and health promotion.' },
        { name: 'Public Health', description: 'Concerned with protecting and improving the health of communities.' },
    ],
    law: [
        { name: 'Juris Doctor (JD)', description: 'The primary professional degree for lawyers.' },
        { name: 'Paralegal Studies', description: 'Trains students to assist lawyers in their legal work.' },
    ],
    design: [
        { name: 'Graphic Design', description: 'Focuses on visual communication and problem-solving.' },
        { name: 'Industrial Design', description: 'The design of mass-produced products.' },
        { name: 'Fashion Design', description: 'The art of applying design and aesthetics to clothing.' },
    ],
};
