const parts = Array.from({ length: 30 }, (_, i) => `الجزء ${i + 1}`);
const partListContainer = document.getElementById('part-list');
const partListButton = document.getElementById('part-list-button');
const ayaContainer = document.getElementById('aya-container');
const interpretationContent = document.getElementById('interpretation-content');
let audioPlayer = new Audio();

// عرض قائمة الأجزاء عند الضغط على الزر
partListButton.addEventListener('click', () => {
    partListContainer.innerHTML = ""; // تفريغ المحتوى لتجنب التكرار
    parts.forEach((part, index) => {
        const listItem = document.createElement('p');
        listItem.className = "part-item";
        listItem.textContent = part;
        listItem.addEventListener('click', () => loadPart(index + 1));
        partListContainer.appendChild(listItem);
    });
    partListContainer.classList.toggle('hidden'); // عرض أو إخفاء القائمة
});

function loadPart(partNumber) {
    document.getElementById('sura-name').textContent = `الجزء ${partNumber}`;
    ayaContainer.innerHTML = ""; 

    fetch(`https://api.alquran.cloud/v1/juz/${partNumber}`)
        .then(response => response.json())
        .then(data => {
            data.data.ayahs.forEach(ayah => {
                const ayaElement = document.createElement('p');
                ayaElement.textContent = `${ayah.surah.name} - ${ayah.numberInSurah} - ${ayah.text}`;
                ayaElement.className = 'ayah';
                ayaElement.addEventListener('click', () => loadInterpretation(ayah.number));
                ayaElement.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    showReciterList(ayah.number);
                });
                ayaContainer.appendChild(ayaElement);
            });
        });
}

function loadInterpretation(ayahNumber) {
    fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/ar.muyassar`)
        .then(response => response.json())
        .then(data => {
            interpretationContent.textContent = data.data.text;
        });
}

function showReciterList(ayahNumber) {
    document.getElementById('reciter-list').classList.remove('hidden');
    audioPlayer.ayahNumber = ayahNumber;
}

function playAyah() {
    const reciter = document.getElementById('reciter-select').value;
    const ayahNumber = audioPlayer.ayahNumber;

    const audioUrl = `https://everyayah.com/data/${reciter}_128kbps/${ayahNumber.toString().padStart(6, '0')}.mp3`;
    audioPlayer.src = audioUrl;
    audioPlayer.play();
}

function stopAyah() {
    audioPlayer.pause();
}