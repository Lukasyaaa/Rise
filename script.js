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
        const burger = document.querySelector(".burger");
        if(burger){
            burger.addEventListener("click", () => {
                header.classList.toggle("_active");
            });
        }
    }

    const menu = document.querySelector(".menu");
    const menuInner = document.querySelector(".menu__list");
    if(container){
        containerPaddingLeft = parseFloat(getComputedStyle(container).paddingLeft);
        containerPaddingRight = parseFloat(getComputedStyle(container).paddingRight);
        containerWidth = container.getBoundingClientRect().width;
        isSmallerEqual992px = parseFloat(getComputedStyle(container).minHeight) === 80;

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
                console.log(menuInnerLeft, menuInnerRight);

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
                    menuInner.style.minWidth = (menuInnerWidth + neededPadding) + "px";
                    menu.style.justifyContent = flexPosition;
                } else{
                    menu.classList.add("_not-centered");
                }

                console.log(menuInner.getBoundingClientRect());
            }
        }
    }

    const menuLinks = document.querySelectorAll(".menu__link a");
    const menuLinksParents = document.querySelectorAll(".menu__link:not(._current)");
    if(menuLinks && menuLinksParents && menuInner){
        isSmallerEqual768px = getComputedStyle(menuLinks[0]).color !== "rgb(186, 185, 185)";

        const addEventListeners = (el, i) => {
            el.addEventListener("mouseenter", () => handleInteract(i));
            el.addEventListener("focus", () => handleInteract(i));
            el.addEventListener("mouseleave", () => {
                if(el !== document.activeElement) handleEndInteract(el, i)
            });
            el.addEventListener("blur", () => handleEndInteract(el, i))
        }

        const handleInteract = (i) => {
            menuLinksParents[i].classList.add("_intrct");
            menuInner.classList.add("_hide-active");
        };
        
        addEventListeners(menuLinks[0], 0);
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
            if(header){
                menuLinks[0].addEventListener("focus", () => header.classList.add("_active"));
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

        Array.from(menuLinks).slice(1).forEach((menuLink, i) => {
            addEventListeners(menuLink, i+1);
        });
    }

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
};