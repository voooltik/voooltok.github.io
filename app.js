window.addEventListener('load', () => {
  const selectedActivities = new Set();

  const activityElements = document.querySelectorAll('.activity-circle');
  activityElements.forEach(el => {
    el.addEventListener('click', () => {
      const type = el.dataset.activity;
      if (selectedActivities.has(type)) {
        selectedActivities.delete(type);
        el.classList.remove('selected');
      } else {
        selectedActivities.add(type);
        el.classList.add('selected');
      }
    });
  });

  const navButtons = {
    route: document.getElementById('nav-route'),
    promos: document.getElementById('nav-promos'),
    tinder: document.getElementById('nav-tinder')
  };

  const sections = {
    main: document.getElementById('main-section'),
    route: document.getElementById('route-display'),
    promos: document.getElementById('promos'),
    tinder: document.getElementById('tinder-section'),
    placeInfo: document.getElementById('place-info')
  };

  Object.entries(navButtons).forEach(([key, btn]) => {
    btn.addEventListener('click', () => {
      Object.values(sections).forEach(s => s.style.display = 'none');
      Object.values(navButtons).forEach(b => b.classList.remove('active'));

      btn.classList.add('active');
      sections[key].style.display = 'block';
    });
  });

  const places = [
    {
      name: "Набережная Волги",
      description: "Место для неспешных прогулок у реки.",
      coordinates: [57.6241, 39.8846],
      type: "walk",
      age: "all",
      image: "https://upload.wikimedia.org/wikipedia/commons/2/23/Yaroslavl_riverfront.jpg"
    },
    {
      name: "Ресторан Уют",
      description: "Домашняя кухня и уютная атмосфера.",
      coordinates: [57.6235, 39.8877],
      type: "eat",
      age: "adult",
      image: "https://via.placeholder.com/400x200.png?text=Ресторан+Уют"
    },
    {
      name: "Парк на Даманском острове",
      description: "Подходит для детей и взрослых.",
      coordinates: [57.6209, 39.8790],
      type: "walk",
      age: "child",
      image: "https://via.placeholder.com/400x200.png?text=Парк+Даманский"
    },
    {
      name: "Музей истории",
      description: "Познавательное место для всех возрастов.",
      coordinates: [57.6217, 39.8892],
      type: "visit",
      age: "teen",
      image: "https://via.placeholder.com/400x200.png?text=Музей+Истории"
    }
  ];

  // Показываем маршрут
  document.getElementById('show-route').addEventListener('click', () => {
    const ageFilter = document.getElementById('age').value;
    const duration = parseInt(document.getElementById('duration').value);
    const maxPlaces = duration * 2;

    let startPoint = document.getElementById('startInput').value.trim();
    if (!startPoint) startPoint = "Советская площадь";

    const filtered = places.filter(p =>
      (selectedActivities.has(p.type)) &&
      (ageFilter === "all" || p.age === ageFilter || p.age === "all")
    ).slice(0, maxPlaces);

    if (filtered.length === 0) {
      alert("Нет подходящих мест. Попробуйте изменить фильтры.");
      return;
    }

    document.getElementById('main-section').style.display = 'none';
    document.getElementById('route-display').style.display = 'block';
    navButtons.route.classList.add('active');
    navButtons.promos.classList.remove('active');
    navButtons.tinder.classList.remove('active');

    const info = document.getElementById('route-info');
    info.innerHTML = "";

    filtered.forEach((place, idx) => {
      const div = document.createElement('div');
      div.className = 'route-step';
      div.innerHTML = `
        <strong>${idx + 1}. ${place.name}</strong>
        <div class="description" style="display:none;">${place.description}</div>
        <button onclick="this.previousElementSibling.style.display='block'; this.remove()">Я тут</button>
      `;
      info.appendChild(div);
    });

    renderMapFromInput(startPoint, filtered.map(p => p.coordinates));
  });

  // Tinder логика
  let tinderIndex = 0;
  function renderTinderCard() {
    const ageFilter = document.getElementById('age').value;
    const available = places.filter(p =>
      ageFilter === "all" || p.age === ageFilter || p.age === "all"
    );

    if (tinderIndex >= available.length) {
      document.getElementById('tinder-card').innerHTML = "<p>Места закончились.</p>";
      document.querySelector('.tinder-buttons').style.display = 'none';
      return;
    }

    const place = available[tinderIndex];
    document.getElementById('tinder-card').innerHTML = `
      <img src="${place.image}" style="width:100%; border-radius: 0.5rem; margin-bottom:1rem" />
      <h3>${place.name}</h3>
      <p>${place.description}</p>
    `;
    document.querySelector('.tinder-buttons').style.display = 'flex';

    document.getElementById('skip').onclick = () => {
      tinderIndex++;
      renderTinderCard();
    };

    document.getElementById('go').onclick = () => {
      sections.tinder.style.display = 'none';
      sections.route.style.display = 'block';
      renderMapFromInput(document.getElementById('startInput').value || "Советская площадь", [place.coordinates]);
      document.getElementById('route-info').innerHTML = `
        <div class="route-step">
          <strong>${place.name}</strong>
          <div class="description" style="display:none;">${place.description}</div>
          <button onclick="this.previousElementSibling.style.display='block'; this.remove()">Я тут</button>
        </div>
      `;
    };
  }

  navButtons.tinder.addEventListener('click', () => {
    sections.main.style.display = 'none';
    sections.route.style.display = 'none';
    sections.promos.style.display = 'none';
    sections.placeInfo.style.display = 'none';
    sections.tinder.style.display = 'block';
    tinderIndex = 0;
    renderTinderCard();
  });

  // Аудиогид и "Назад"
  document.getElementById('audio-btn').addEventListener('click', () => {
    alert("🔊 Здесь будет аудиогид.");
  });

  document.getElementById('back-to-tinder').addEventListener('click', () => {
    sections.placeInfo.style.display = 'none';
    sections.tinder.style.display = 'block';
  });

  function renderMapFromInput(inputText, coordsArray) {
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(inputText)}&format=json`)
      .then(res => res.json())
      .then(data => {
        const point = data[0];
        if (!point) throw new Error("Стартовая точка не найдена");

        const startCoords = [parseFloat(point.lat), parseFloat(point.lon)];
        renderMap(startCoords, coordsArray);
      })
      .catch(() => {
        alert("Не удалось найти начальную точку. Используем Советскую площадь.");
        renderMap([57.6261, 39.8845], coordsArray);
      });
  }

  function renderMap(startCoords, targets) {
    const map = L.map('map').setView(startCoords, 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const latlngs = [];
    L.marker(startCoords).addTo(map).bindPopup("Стартовая точка").openPopup();
    targets.forEach(coord => {
      L.marker(coord).addTo(map);
      latlngs.push(coord);
    });

    if (latlngs.length > 1) {
      L.polyline([startCoords, ...latlngs], { color: 'deepskyblue' }).addTo(map);
    }
  }
});
