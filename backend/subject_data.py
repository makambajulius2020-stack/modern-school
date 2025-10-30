# Uganda Curriculum Subject Selection Data

O_LEVEL_SUBJECTS = {
    'compulsory': ['English', 'Mathematics', 'Biology', 'Chemistry', 'Physics'],
    'optional': {
        'humanities': ['History', 'Geography', 'Religious Education', 'Literature'],
        'commercial': ['Commerce', 'Entrepreneurship'],
        'technical': ['Agriculture', 'Computer Studies', 'Fine Art', 'Music'],
        'languages': ['French', 'Luganda']
    }
}

A_LEVEL_COMBINATIONS = [
    {
        'code': 'PCM',
        'name': 'Physics, Chemistry, Mathematics',
        'subjects': ['Physics', 'Chemistry', 'Mathematics', 'ICT'],
        'careers': ['Engineering', 'Medicine', 'Computer Science'],
        'difficulty': 5
    },
    {
        'code': 'PCB',
        'name': 'Physics, Chemistry, Biology',
        'subjects': ['Physics', 'Chemistry', 'Biology', 'Mathematics'],
        'careers': ['Medicine', 'Dentistry', 'Pharmacy', 'Nursing'],
        'difficulty': 5
    },
    {
        'code': 'HEG',
        'name': 'History, Economics, Geography',
        'subjects': ['History', 'Economics', 'Geography', 'Divinity'],
        'careers': ['Law', 'Social Work', 'Public Administration'],
        'difficulty': 3
    }
]

CAREER_PATHS = {
    'Medicine': {'salary': '3M-15M UGX', 'demand': 'High'},
    'Engineering': {'salary': '2M-10M UGX', 'demand': 'High'},
    'Law': {'salary': '2M-20M UGX', 'demand': 'Medium'}
}
