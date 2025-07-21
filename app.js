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
    },
    {
      name: "Кофейня 'Черный кот'",
      description: "Модная кофейня с атмосферой минимализма и specialty-кофе.",
      coordinates: [57.6223, 39.8915],
      type: "eat",
      age: "teen",
      image: "https://via.placeholder.com/400x200.png?text=Черный+кот+кофейня"
    },
    {
      name: "Уличный арт на ул. Свободы",
      description: "Граффити и муралы на фасадах домов — отличное место для фото.",
      coordinates: [57.6211, 39.8932],
      type: "walk",
      age: "all",
      image: "https://via.placeholder.com/400x200.png?text=Стрит-Арт+Свобода"
    },
    {
      name: "Бар 'Гараж'",
      description: "Современный бар с живой музыкой по выходным. Только для взрослых.",
      coordinates: [57.6230, 39.8880],
      type: "eat",
      age: "adult",
      image: "https://via.placeholder.com/400x200.png?text=Бар+Гараж"
    },
    {
      name: "Смотровая площадка на Стрелке",
      description: "Панорамный вид на слияние Волги и Которосли, особенно красиво на закате.",
      coordinates: [57.6264, 39.8848],
      type: "walk",
      age: "all",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Yaroslavl_strelka.jpg"
    },
    {
      name: "Музей современного искусства",
      description: "Выставки местных и российских художников, инсталляции и перформансы.",
      coordinates: [57.6199, 39.8910],
      type: "visit",
      age: "teen",
      image: "https://via.placeholder.com/400x200.png?text=Музей+Совр+Искусства"
    },
    {
      name: "Лофт-площадка 'Фабрика'",
      description: "Креативное пространство с маркетами, лекциями и мастер-классами.",
      coordinates: [57.6248, 39.8861],
      type: "visit",
      age: "teen",
      image: "https://via.placeholder.com/400x200.png?text=Фабрика+Лофт"
    },
    {
      name: "Парк 1000-летия",
      description: "Большой городской парк с дорожками, качелями и фудкортами.",
      coordinates: [57.6273, 39.8857],
      type: "walk",
      age: "child",
      image: "https://via.placeholder.com/400x200.png?text=Парк+1000-летия"
    },
    {
      name: "Бургерная 'Мясоедов'",
      description: "Авторские бургеры, мясо на гриле, craft-напитки.",
      coordinates: [57.6227, 39.8822],
      type: "eat",
      age: "all",
      image: "https://via.placeholder.com/400x200.png?text=Мясоедов"
    },
    {
      name: "VR-клуб 'Альфа'",
      description: "Погрузитесь в виртуальную реальность — игры и квесты для всех возрастов.",
      coordinates: [57.6255, 39.8888],
      type: "visit",
      age: "teen",
      image: "https://via.placeholder.com/400x200.png?text=VR+Клуб+Альфа"
    },
    {
      name: "Ярославский Арбат (ул. Кирова)",
      description: "Пешеходная улица с кафе, сувенирными лавками и уличными музыкантами.",
      coordinates: [57.6218, 39.8869],
      type: "walk",
      age: "all",
      image: "https://via.placeholder.com/400x200.png?text=Ярославский+Арбат"
    }    
  ];

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

  // Аудиогид и назад
  document.getElementById('audio-btn')?.addEventListener('click', () => {
    alert("🔊 Аудиогид скоро будет доступен.");
  });

  document.getElementById('back-to-tinder')?.addEventListener('click', () => {
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

  // ✅ ОСНОВНАЯ ФУНКЦИЯ ПОСТРОЕНИЯ МАРШРУТА С РАССТОЯНИЕМ И ВРЕМЕНЕМ
  function renderMap(startCoords, targets) {
    const map = L.map('map').setView(startCoords, 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker(startCoords).addTo(map).bindPopup("Стартовая точка").openPopup();

    if (targets.length === 0) return;

    const end = targets[0];

    const url = `https://router.project-osrm.org/route/v1/foot/${startCoords[1]},${startCoords[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const route = data.routes[0];
        if (!route) throw new Error("Маршрут не найден");

        const distanceKm = (route.distance / 1000).toFixed(2);
        const durationMin = Math.round(route.duration / 60);

        L.geoJSON(route.geometry, {
          style: {
            color: 'deepskyblue',
            weight: 5
          }
        }).addTo(map);

        L.marker(end).addTo(map).bindPopup("Пункт назначения");

        const info = document.getElementById('route-info');
        const summary = document.createElement('div');
        summary.style.marginTop = '1rem';
        summary.innerHTML = `<p><strong>Дистанция:</strong> ${distanceKm} км<br><strong>Время в пути:</strong> ~${durationMin} мин</p>`;
        info.prepend(summary);
      })
      .catch(() => {
        alert("Не удалось построить маршрут. Проверьте координаты.");
      });
  }
});
