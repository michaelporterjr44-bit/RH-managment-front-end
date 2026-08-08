export const availableIcons = [
    'linkedin',
    'twitter',
    'facebook',
    'instagram',
    'youtube',
    'mail',
    'phone',
    'message',
    'globe',
    'camera',
    'music',
    'video'
];

export const getIconClass = (nom?: string) => {
    if (!nom) return 'ri-globe-line'; 

    switch (nom.toLowerCase()) {
        case 'linkedin':
            return 'ri-linkedin-line';
        case 'twitter':
            return 'ri-twitter-line';
        case 'facebook':
            return 'ri-facebook-line';
        case 'instagram':
            return 'ri-instagram-line';
        case 'youtube':
            return 'ri-youtube-line';
        case 'mail':
            return 'ri-mail-line';
        case 'phone':
            return 'ri-phone-line';
        case 'message':
            return 'ri-message-line';
        default:
            return 'ri-globe-line';
    }
};

