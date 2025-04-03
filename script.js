window.onload = () => {
    let isSmallerEqual480px = undefined;
    let isSmallerEqual768px = undefined;
    let isSmallerEqual992px = undefined;

    const container = document.querySelector(".container");
    let containerWidth = 0;
    let containerPaddingLeft = 0;
    let containerPaddingRight = 0;
    
    const header = document.querySelector(".header");
    if(header){
        /*Добавляем возможность показа/cкрытия Меню при нажатии на Бургер*/
        const burger = document.querySelector(".burger");
        if(burger){
            burger.addEventListener("click", () => {
                header.classList.toggle("_active");
            });
        }

        window.addEventListener("scroll", () => {
            if(window.scrollY !== 0){
                header.classList.add("_scroll");
            } else {
                header.classList.remove("_scroll");
            }
        });

        /*Добавляем Марджин для Секции Интро, равный Высоте Хедера*/
        const introSection = document.querySelector(".intro");
        if(introSection){
            introSection.style.paddingTop = 
            ((header.offsetHeight + parseFloat(getComputedStyle(introSection).paddingTop)) / 16) + "rem";
        }
    }

    const menu = document.querySelector(".menu");
    const menuInner = document.querySelector(".menu__list");
    if(container){
        containerPaddingLeft = parseFloat(getComputedStyle(container).paddingLeft);
        containerPaddingRight = parseFloat(getComputedStyle(container).paddingRight);
        containerWidth = container.getBoundingClientRect().width;
        isSmallerEqual992px = parseFloat(getComputedStyle(container).minHeight) === 80;

        /*Грамотно Позиционируем Контейнер Линков по Центру Страницы*/
        if(menu && menuInner){
            isSmallerEqual768px = getComputedStyle(menu).position === "fixed";
            isSmallerEqual480px = parseFloat(getComputedStyle(menu).paddingTop) === 104;
            
            if(!isSmallerEqual768px){
                const menuInnerWidth = menuInner.getBoundingClientRect().width;
                const pageMinusContainer = (window.innerWidth - containerWidth) / 2;

                const menuMarginLeft = parseFloat(getComputedStyle(menu).marginLeft);
                const leftContentWidth = 
                menu.getBoundingClientRect().left - pageMinusContainer - menuMarginLeft - containerPaddingLeft;
                
                const menuMarginRight = parseFloat(getComputedStyle(menu).marginRight);
                const rightContentWidth = 
                window.innerWidth - (menu.getBoundingClientRect().right + pageMinusContainer + menuMarginRight + containerPaddingRight);

                const windowMinusMenuInner = (window.innerWidth - menuInnerWidth) / 2;
                const menuInnerLeft = windowMinusMenuInner - (pageMinusContainer) - containerPaddingLeft - containerPaddingRight - leftContentWidth;
                const menuInnerRight = windowMinusMenuInner - (pageMinusContainer) - containerPaddingLeft - containerPaddingRight - rightContentWidth;

                let neededPadding = 0;
                let flexPosition;
                /*Одного Присвоения Должного Отсупа - не хватит, ведь Картинка может быть по Ширине больше чем Кнопки
                Это приведёт к тому, что Свободное Пространство Справа будет меньше чем Слева */
                if(rightContentWidth > leftContentWidth){
                    neededPadding = menuInnerRight * 2 - menuMarginRight;
                    flexPosition = "flex-end";
                } else if(leftContentWidth < rightContentWidth){
                    neededPadding = menuInnerLeft * 2 - menuMarginLeft;
                    flexPosition = "flex-start";
                }

                if(neededPadding > 0){
                    menuInner.style.minWidth = ((menuInnerWidth + neededPadding) / 16) + "rem";
                    menu.style.justifyContent = flexPosition;
                } else{
                    menu.classList.add("_not-centered");
                }
            }
        }
    }

    /*Отслеживаем События Наведения и Фокусировки, для Добавления Служебного Класса
    Добавляем Возможность Показа Меню при Фокусировке на Первом Линке
    Если Ширина Экрана больше 480, то Добавляем Возможность Исчезновения Меню, при Конце Фокусировке на Последнем Линке*/
    const menuLinks = document.querySelectorAll(".menu__link a");
    const menuLinksParents = document.querySelectorAll(".menu__link:not(._current)");
    if(menuLinks && menuLinksParents && menuInner){
        isSmallerEqual768px = getComputedStyle(menuLinks[0]).color !== "rgb(186, 185, 185)";

        const handleInteract = (i) => {
            menuLinksParents[i].classList.add("_intrct");
            menuInner.classList.add("_hide-active");
        };
        
        let handleEndInteract;
        if(isSmallerEqual768px){
            handleEndInteract =  (menuLink, i) => {
                menuLinksParents[i].classList.remove("_intrct");
                setTimeout(() => {
                    if (!document.querySelector(".menu__link._intrct")) {
                        menuInner.classList.remove("_hide-active");
                    }
                }, parseFloat(getComputedStyle(menuLink).transitionDuration) * 1000);
            }
            /*Добавляем возможность Показать Меню при Фокусировке на Первом Линке */
            if(header){
                menuLinks[0].addEventListener("focus", () => header.classList.add("_active"));
                /*Если Ширина Экрана больше 480:
                Добавляем возможность Скрывать Меню при Конце Фокусировки на Последнем Линке */
                if(!isSmallerEqual480px){
                    menuLinks[menuLinks.length - 1].addEventListener("blur", () => header.classList.remove("_active"));
                }
            }
        } else {
            handleEndInteract = (menuLink, i) => {
                menuLinksParents[i].classList.remove("_intrct");
                menuInner.classList.remove("_hide-active");
            };
        }

        menuLinks.forEach((menuLink, i) => {
            menuLink.addEventListener("mouseenter", () => handleInteract(i));
            menuLink.addEventListener("focus", () => handleInteract(i));
            menuLink.addEventListener("mouseleave", () => {
                if(menuLink !== document.activeElement) handleEndInteract(menuLink, i)
            });
            menuLink.addEventListener("blur", () => handleEndInteract(menuLink, i))
        });
    }
    
    /*Делаем Коррекные Таб Индексы, при Скрытии Меню,
    Добавляем Возможность прятать Меню после Конца Фокусировки на Кнопке Зарегестрироваться*/
    if(isSmallerEqual768px && isSmallerEqual480px !== undefined){
        const signIn = document.querySelector(".header__sign-in");
        const signUp = document.querySelector(".header__sign-up");
        const burger = document.querySelector(".header__burger");
        const menuSignUp = document.querySelector(".menu__sign-up");
        if(isSmallerEqual480px){
            signIn.disabled = true;
            signUp.disabled = true;
            burger.tabIndex = 1;
            if(header){
                menuSignUp.addEventListener("blur", () => header.classList.remove("_active"));
            }
        } else {
            signIn.tabIndex = 1;
            signUp.tabIndex = 2;
            burger.tabIndex = 3;
        }
    }

    const getMonth = (numb) => {
        switch(numb){
            case 1:
                return "Jan";
            case 2:
                return "Feb";
            case 3:
                return "Mar";
            case 4:
                return "Apr";
            case 5:
                return "May";
            case 6:
                return "Jun";
            case 7:
                return "Jul";
            case 8:
                return "Aug";
            case 9:
                return "Sep";
            case 10:
                return "Oct";
            case 11:
                return "Nov";
            default:
                return "Dec";
        }
    }

    /*Делаем Динамичный Выбор Нынешнего Месяца, с удалением Неактуальных и добавлением Актуальных*/
    if(!isSmallerEqual992px){
        const monthesContainer = document.querySelector(".statistics-intro__calendar")
        const monthes = document.querySelectorAll(".statistics-intro__month");
        const today = new Date();
        if(monthesContainer && monthes){
            if(today.getMonth() + 1 > monthes.length){
                for(let i = monthes.length + 1; i <= today.getMonth() + 1; i++){
                    document.querySelectorAll(".statistics-intro__month")[0].remove();

                    let newMonth = document.createElement("li");
                    newMonth.classList.add("statistics-intro__month");
                    newMonth.innerText = getMonth(i);

                    monthesContainer.append(newMonth);
                }
                document.querySelectorAll(".statistics-intro__month")[monthes.length - 1].classList.add("_current");
            } else {
                monthes[today.getMonth()].classList.add("_current");
            }
        }
    }

    const equalizeSlideHeights = () => {
        const slides = document.querySelectorAll('.works .swiper-slide');
        let maxHeight = 0;
      
        // Находим максимальную высоту среди всех слайдов
        slides.forEach(slide => {
            maxHeight = Math.max(maxHeight, slide.offsetHeight);
        });
      
        slides.forEach(slide => {
            slide.style.height = `${maxHeight}px`;
        });
    }

    new Swiper(".works__slider", {
        navigation: {
            nextEl: ".works__arrow_next",
            prevEl: ".works__arrow_prev"
        },
        grabCursor: true,
        slidesPerView: "auto",
        watchOverflow: true,
        spaceBetween: 30,
        breakpoints: {
            768: {
                spaceBetween: 24
            },
            480: {
                spaceBetween: 16
            }
        }
    });
    equalizeSlideHeights();

    const reviewsSlides = document.querySelectorAll(".reviews .swiper-slide");
    new Swiper(".reviews__slider", {
        grabCursor: true,
        slidesPerView: "auto",
        watchOverflow: true,
        spaceBetween: 30,
        centeredSlides: true,
        initialSlide: (reviewsSlides) ? (Math.floor(reviewsSlides.length / 2) + (reviewsSlides % 2 === 0)) : 3,
        breakpoints: {
            768: {
                spaceBetween: 24
            },
            480: {
                spaceBetween: 16
            }
        },
        pagination:{
            el: ".reviews__dots",
            clickable: true
        },
        mousewheel:{
            sensivity: 1,
        }
    });

    const reviewsDotsContainer = document.querySelector(".reviews__dots");
    const reviewsDots = document.querySelectorAll(".swiper-pagination-bullet:not(.swiper-pagination-bullet-active)");
    
    console.log(reviewsDots, reviewsDotsContainer);
    if(reviewsDots && reviewsDotsContainer){
        reviewsDots.forEach(reviewDot => {
            reviewDot.addEventListener("mouseenter", () => {
                reviewDot.classList.add("_intrct");
                reviewsDotsContainer.classList.add("_hide-active");

            });
            reviewDot.addEventListener("focus", () => {
                reviewDot.classList.add("_intrct");
                reviewsDotsContainer.classList.add("_hide-active");
            });
            reviewDot.addEventListener("mouseleave", () => {
                if(document.activeElement !== reviewDot){
                    reviewDot.classList.remove("_intrct");
                    reviewsDotsContainer.classList.remove("_hide-active");
                }
            });
            reviewDot.addEventListener("blur", () => {
                reviewDot.classList.remove("_intrct");
                reviewsDotsContainer.classList.remove("_hide-active");
            });
        });
    }
};