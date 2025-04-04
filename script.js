window.onload = () => {
    let isSmallerEqual480px = undefined;
    let isSmallerEqual768px = undefined;
    let isSmallerEqual992px = undefined;
    
    const handleInteract = (el, container) => {
        el.classList.add("_intrct");
        container.classList.add("_hide-active");
    };
    const handleEndInteract = (el, container) => {
        el.classList.remove("_intrct");
        container.classList.remove("_hide-active");
    };
    const handleMouseEndInteract = (el, container) => {
        if(document.activeElement !== el){
            handleEndInteract(el, container);
        }
    };

    const header = document.querySelector(".header");
    if(header){
        /*Добавляем возможность показа/cкрытия Меню при нажатии на Бургер*/
        const burger = document.querySelector(".burger");
        if(burger){
            burger.addEventListener("click", () => {
                header.classList.toggle("_active");
            });
        }

        /*Добавляем Класс, что делает тень для Шапки при Скролле*/
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

    const container = document.querySelector(".container");
    const menu = document.querySelector(".menu");
    const menuInner = document.querySelector(".menu__list");
    if(container){
        const containerPaddingLeft = parseFloat(getComputedStyle(container).paddingLeft);
        const containerPaddingRight = parseFloat(getComputedStyle(container).paddingRight);
        const containerWidth = container.getBoundingClientRect().width;
        isSmallerEqual992px = parseFloat(getComputedStyle(container).minHeight) === 80;

        /*Грамотно Позиционируем Контейнер Линков по Центру Страницы*/
        if(menu && menuInner){
            isSmallerEqual768px = getComputedStyle(menu).position === "fixed";
            isSmallerEqual480px = parseFloat(getComputedStyle(menu).paddingTop) === 104;
            
            if(!isSmallerEqual768px){
                const pageMinusContainer = (window.innerWidth - containerWidth) / 2;

                const menuMarginLeft = parseFloat(getComputedStyle(menu).marginLeft);
                const leftContentWidth = 
                menu.getBoundingClientRect().left - pageMinusContainer - menuMarginLeft - containerPaddingLeft;
                
                const menuMarginRight = parseFloat(getComputedStyle(menu).marginRight);
                const rightContentWidth = 
                window.innerWidth - (menu.getBoundingClientRect().right + pageMinusContainer + menuMarginRight + containerPaddingRight);
                
                const menuInnerWidth = menuInner.getBoundingClientRect().width;
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
    if(menuLinks.length && menuLinksParents.length && menuInner){
        isSmallerEqual768px = getComputedStyle(menuLinks[0]).color !== "rgb(186, 185, 185)";
        
        let menuHandleEndInteract;
        if(isSmallerEqual768px){
            menuHandleEndInteract =  (menuLink, i) => {
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
            menuHandleEndInteract = handleEndInteract;
        }

        menuLinks.forEach((menuLink, i) => {
            menuLink.addEventListener("mouseenter", () => handleInteract(menuLinksParents[i], menuInner));
            menuLink.addEventListener("focus", () => handleInteract(menuLinksParents[i], menuInner));
            menuLink.addEventListener("mouseleave", () => menuHandleEndInteract(menuLinksParents[i], menuInner));
            menuLink.addEventListener("blur", () => handleEndInteract(menuLinksParents[i], menuInner))
        });
    }
    
    /*Делаем Коррекные Таб Индексы, при Скрытии Меню,
    Добавляем Возможность прятать Меню после Конца Фокусировки на Кнопке Зарегестрироваться*/
    const authorization = document.querySelector(".header__authorization");
    const signIn = document.querySelector(".header__sign-in");
    const signUp = document.querySelector(".header__sign-up");
    const burger = document.querySelector(".header__burger");
    const menuSignUp = document.querySelector(".menu__sign-up");
    if(authorization && signIn && signUp && burger && menuSignUp){
        isSmallerEqual768px = getComputedStyle(burger).display !== "none";
        if(isSmallerEqual768px){
            isSmallerEqual480px = getComputedStyle(authorization).display === "none";
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
    }

    /*Делаем Динамичный Выбор Нынешнего Месяца, с удалением Неактуальных и добавлением Актуальных*/
    const statistics = document.querySelector(".intro__statistics");
    if(statistics){
        isSmallerEqual992px = getComputedStyle(statistics).display === "none";
        if(!isSmallerEqual992px){
            const monthesContainer = document.querySelector(".statistics-intro__calendar")
            const monthes = document.querySelectorAll(".statistics-intro__month");
            if(monthesContainer && monthes.length){
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
                const today = new Date();
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
    }

    const equalizeSlideHeights = () => {
        const slides = document.querySelectorAll('.works .swiper-slide');
        if(slides.length){
            let maxHeight = 0;
            slides.forEach(slide => { maxHeight = Math.max(maxHeight, slide.getBoundingClientRect().height); });
            slides.forEach(slide => { slide.style.height = `${maxHeight}px`; });
        }
    }

    const worksSlider = document.querySelector(".works__slider");
    if(worksSlider){
        const worksNextArrow = document.querySelector(".works__arrow_next");
        const worksPrevArrow = document.querySelector(".works__arrow_prev");
        let navigation = {};

        if (worksNextArrow) navigation.nextEl = ".works__arrow_next";
        if (worksPrevArrow) navigation.prevEl = ".works__arrow_prev";

        new Swiper(".works__slider", {
            navigation: navigation,
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
            },
            on: {
                init: equalizeSlideHeights
            }
        });
    }

    const reviewsSlider = document.querySelector(".reviews__slider");
    const reviewsSlides = document.querySelectorAll(".reviews .swiper-slide");
    if(reviewsSlider && reviewsSlides.length){
        const reviewsDotsContainer = document.querySelector(".reviews__dots");
        let pagination = null;
        let on = null;
        if(reviewsDotsContainer){
            pagination = {
                el: ".reviews__dots",
                clickable: true
            }

            const clickReviewDotHandle = () => {
                const clickedReviewDot = document.querySelector(".swiper-pagination-bullet-active");
                if(clickedReviewDot){
                    clickedReviewDot.tabIndex = -1;
                    clickedReviewDot.removeEventListener("mouseenter", () => handleInteract(clickedReviewDot, reviewsDotsContainer));
                    clickedReviewDot.removeEventListener("focus", () => handleInteract(clickedReviewDot, reviewsDotsContainer));
                    clickedReviewDot.removeEventListener("mouseleave", () => handleMouseEndInteract(clickedReviewDot, reviewsDotsContainer));
                    clickedReviewDot.removeEventListener("blur", () => handleEndInteract(clickedReviewDot, reviewsDotsContainer));
                    clickedReviewDot.classList.remove("_intrct");
                    reviewsDotsContainer.classList.remove("_hide-active");
            
                    const oldReviewsCurrentDot = document.querySelector(".swiper-pagination-bullet._active");
                    oldReviewsCurrentDot.tabIndex = 0;
                    oldReviewsCurrentDot.addEventListener("mouseenter", () => handleInteract(oldReviewsCurrentDot, reviewsDotsContainer));
                    oldReviewsCurrentDot.addEventListener("focus", () => handleInteract(oldReviewsCurrentDot, reviewsDotsContainer));
                    oldReviewsCurrentDot.addEventListener("mouseleave", () => handleMouseEndInteract(oldReviewsCurrentDot, reviewsDotsContainer));
                    oldReviewsCurrentDot.addEventListener("blur", () => handleEndInteract(oldReviewsCurrentDot, reviewsDotsContainer));
            
                    oldReviewsCurrentDot.classList.remove("_active");
                    clickedReviewDot.classList.add("_active");
                }
            };

            const reviewsDotsAddEventListeners = () => {
                const reviewsDots = document.querySelectorAll(".swiper-pagination-bullet:not(.swiper-pagination-bullet-active)");
                const reviewsCurrentDot = document.querySelector(".swiper-pagination-bullet-active");
                if(reviewsCurrentDot){
                    reviewsCurrentDot.tabIndex = -1;
                    reviewsCurrentDot.classList.add("_active");
                }
                if(reviewsDots){
                    reviewsDots.forEach(reviewsDot => {
                        reviewsDot.addEventListener("mouseenter", () => handleInteract(reviewsDot, reviewsDotsContainer));
                        reviewsDot.addEventListener("focus", () => handleInteract(reviewsDot, reviewsDotsContainer));
                        reviewsDot.addEventListener("mouseleave", () => handleMouseEndInteract(reviewsDot, reviewsDotsContainer));
                        reviewsDot.addEventListener("blur", () => handleEndInteract(reviewsDot, reviewsDotsContainer));
                    });
                }
            }

            on = {
                slideChange: clickReviewDotHandle,
                init: reviewsDotsAddEventListeners
            }
        }
        new Swiper(".reviews__slider", {
            grabCursor: true,
            slidesPerView: "auto",
            watchOverflow: true,
            spaceBetween: 30,
            centeredSlides: true,
            initialSlide: Math.floor(reviewsSlides.length / 2) + (reviewsSlides % 2 === 0),
            breakpoints: {
                768: {
                    spaceBetween: 24
                },
                480: {
                    spaceBetween: 16
                }
            },
            pagination: pagination,
            on: on
        });
    }
    
    const footerColumns = document.querySelectorAll(".column-footer");
    const footerLists = document.querySelectorAll(".column-footer__list");
    const footerListOpeners = document.querySelectorAll(".column-footer__title button");
    if(footerLists.length && footerListOpeners.length && footerColumns.length){
        isSmallerEqual480px = getComputedStyle(footerLists[0]).overflow === "hidden";
        if(isSmallerEqual480px){
            const footerListsHeight = Array.from(footerLists, el => el.offsetHeight);
            footerLists.forEach(footerList => {
                footerList.style.height = "0px";
            });

            footerListOpeners.forEach((footerListOpener, i) => {
                footerListOpener.addEventListener("click", () => {
                    footerColumns[i].classList.toggle("_active");
                    if(footerColumns[i].classList.contains("_active")){
                        footerLists[i].style.height = footerListsHeight[i] + "px";
                    } else {
                        footerLists[i].style.height = "0px";
                    }
                });
            });

            footerColumns.forEach((_, i) => {
                const footerFirstLink = document.querySelector(".column-footer:nth-child(" + Number(i + 1) + ") .column-footer__link:first-child a");
                const footerEndLink = document.querySelector(".column-footer:nth-child(" + Number(i + 1) + ") .column-footer__link:last-child a");
                if(footerFirstLink){
                    footerFirstLink.addEventListener("focus", () => {
                        footerColumns[i].classList.add("_active");
                        footerLists[i].style.height = footerListsHeight[i] + "px";
                    });
                }
                if(footerEndLink){
                    footerEndLink.addEventListener("blur", () => {
                        footerColumns[i].classList.remove("_active");
                        footerLists[i].style.height = "0px";
                    });
                }
            });
        }
    }
};