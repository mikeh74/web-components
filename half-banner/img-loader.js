window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    // Get the banner element and its data-bg-image attribute
    const banner = document.querySelector('.half-banner');
    if (banner) {
        const bgImage = banner.getAttribute('data-bg-image');
        console.log('Background image URL:', bgImage);
        if (bgImage) {
            console.log('Loading background image:', bgImage);
            const image = new Image();
            image.src = bgImage;
            image.onload = () => {
                console.log('Background image loaded successfully');
                document.documentElement.style.setProperty(
                    '--img-banner',
                    `url('${bgImage}')`
                );
            };
        }
    }
});