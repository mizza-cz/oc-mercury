var disabledColor = "#e2e2e2";
var currentMap = null;
var currentLanguage = "cs";
//Print color styles
var notSelector = '[data-disabled="false"]';
var hideInfoElementsSelectors = [
  "*[id^=info-icon]", //All infoicons
  ".st29", //Entrances 1,2
  "#parkovisko_vonkajsie_2", //Parking 2
  "*[id^=parkovisko_vonkajsie_1_]", //Parking 1
  ".st145", // Arror parking
  ".st16",
  "#vchod_3", //Entrance 3
  "#parkovisko_vonkajsie_3",
  "#parkovisko_vonkajsie_4",
  "#vchod_4",
];
function LightenDarkenColor(color, percent) {
  var R = parseInt(color.substring(1, 3), 16);
  var G = parseInt(color.substring(3, 5), 16);
  var B = parseInt(color.substring(5, 7), 16);
  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);
  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;
  R = Math.round(R);
  G = Math.round(G);
  B = Math.round(B);
  var RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
  var GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
  var BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);
  return "#" + RR + GG + BB;
}
mapCategories = mapCategories.map(function (c) {
  var highlight = LightenDarkenColor(c.color, 10);

  return {
    ...c,
    colorDarker: LightenDarkenColor(c.color, -10),
    colorDark: LightenDarkenColor(c.color, -20),
    colorHighlight: highlight,
    colorHighlightDarker: LightenDarkenColor(highlight, -10),
    colorHighlightDark: LightenDarkenColor(highlight, -20),
  };
});

$(hideInfoElementsSelectors.join(",")).addClass("hideable");

$("#category-styles").html(
  [
    ...mapCategories.map(function (c) {
      return `
                .category-${c.id}[id*=_1_]${notSelector},
                .category-${c.id}[id*=_1_]${notSelector} > polygon,
                .category-${c.id}[id*=_1_]${notSelector} > path {
                    fill: ${c.color} !important;
                }

                .category-${c.id}[id*=_2_]${notSelector},
                .category-${c.id}[id*=_2_]${notSelector} > polygon,
                .category-${c.id}[id*=_2_]${notSelector} > path {
                    fill: ${c.colorDarker} !important;
                }

                .category-${c.id}[id*=_3_]${notSelector},
                .category-${c.id}[id*=_3_]${notSelector} > polygon,
                .category-${c.id}[id*=_3_]${notSelector} > path {
                    fill: ${c.colorDark} !important;
                }
                
                .category-${c.id}.highlight[id*=_1_]${notSelector},
                .category-${c.id}.highlight[id*=_1_]${notSelector} > polygon,
                .category-${c.id}.highlight[id*=_1_]${notSelector} > path {
                    fill: ${c.colorHighlight} !important;
                }

                .category-${c.id}.highlight[id*=_2_]${notSelector},
                .category-${c.id}.highlight[id*=_2_]${notSelector} > polygon,
                .category-${c.id}.highlight[id*=_2_]${notSelector} > path {
                    fill: ${c.colorHighlightDarker} !important;
                }

                .category-${c.id}.highlight[id*=_3_]${notSelector},
                .category-${c.id}.highlight[id*=_3_]${notSelector} > polygon,
                .category-${c.id}.highlight[id*=_3_]${notSelector} > path {
                    fill: ${c.colorHighlightDark} !important;
                }
            `;
    }),
    `
            .disabled,
            .disabled > polygon,
            .disabled > path,
            *[data-disabled="true"],
            *[data-disabled="true"] > polygon,
            *[data-disabled="true"] > path {
                fill: ${disabledColor} !important;
                pointer-events: none !important;
            }

            .disabled.darker,
            .disabled.darker > polygon,
            .disabled.darker > path,
            *[data-disabled="true"].darker,
            *[data-disabled="true"].darker > polygon,
            *[data-disabled="true"].darker > path { 
                fill: ${LightenDarkenColor(disabledColor, -10)} !important;
                pointer-events: none !important;
            }

            .disabled.dark,
            .disabled.dark > polygon,
            .disabled.dark > path,
            *[data-disabled="true"].dark,
            *[data-disabled="true"].dark > polygon,
            *[data-disabled="true"].dark > path {
                fill: ${LightenDarkenColor(disabledColor, -20)} !important;
                pointer-events: none !important;
            }
        `,
  ].join("")
);

//Assign proper classes to all entities
Object.values(mapPlaces).forEach(function (place) {
  var placeId = place.toLowerCase().replace(/ /g, "");

  $(
    `#floor-map svg *[id^=s${placeId}_1_], #floor-map svg *[id^=s${placeId.toUpperCase()}_1_]`
  ).addClass("disabled");
  $(
    `#floor-map svg *[id^=s${placeId}_2_], #floor-map svg *[id^=s${placeId.toUpperCase()}_2_]`
  ).addClass("disabled darker");
  $(
    `#floor-map svg *[id^=s${placeId}_3_], #floor-map svg *[id^=s${placeId.toUpperCase()}_3_]`
  ).addClass("disabled dark");
});

Object.values(mapShops).forEach(function (ms) {
  if (ms.categories.length) {
    var shopId = ms.shop_code.toLowerCase().replace(/ /g, "");

    var $elements = $(
      `#floor-map svg *[id^=s${shopId}_], #floor-map svg *[id^=s${shopId.toUpperCase()}_]`
    );

    $elements.removeClass("disabled").attr("data-disabled", "false");

    $(
      `#floor-map svg *[id^=s${shopId}_1], #floor-map svg *[id^=s${shopId.toUpperCase()}_1]`
    ).addClass(`category-${ms.categories[0].id}`);
    $(
      `#floor-map svg *[id^=s${shopId}_2], #floor-map svg *[id^=s${shopId.toUpperCase()}_2]`
    ).addClass(`category-${ms.categories[0].id} darker`);
    $(
      `#floor-map svg *[id^=s${shopId}_3], #floor-map svg *[id^=s${shopId.toUpperCase()}_3]`
    ).addClass(`category-${ms.categories[0].id} dark`);
  }
});

function updateHeightBasedOnWidth() {
  var element = $("#floor-map>.maps-conatiner");
  var width = element.width();
  var optimalHeight;

  if (width >= 500 && width <= 767) {
    optimalHeight = width * 0.6;
  } else {
    optimalHeight = width * 0.7;
  }

  element.height(optimalHeight);
}

function filterShops(val) {
  val = val.toLocaleLowerCase().trim();

  var shopsLength = $(".mapshowshop").length;

  $(".mapshowshop").each(function (e, element) {
    var shopName = $(element).text();

    if (!shopName.toLocaleLowerCase().trim().includes(val)) {
      $(element).slideUp(100);
    } else {
      $(element).parents(".mapshowshops").slideDown(100);
      $(element).slideDown(200);
    }
  });

  $(".mapshowshop")
    .promise()
    .done(function () {
      var hiddenParentShops = $(".mapshowshops").filter(function () {
        return $(this).find(".mapshowshop").not(":hidden").length === 0;
      });

      $(hiddenParentShops).slideUp(100);

      // If resul is empty show alert
      if (hiddenParentShops.find(".mapshowshop").length === shopsLength) {
        $("#filtered-shops-alert").show();
      } else {
        $("#filtered-shops-alert").hide();
      }
    });
}

if ($(".shops-map").length) {
  if ($(".is-kiosk-map").length === 0) {
    $(window).on("resize", updateHeightBasedOnWidth());
    $(document).ready(updateHeightBasedOnWidth());
  }

  var filterInput = $("#input-map-search-shop");
  if (filterInput.length) {
    filterInput.on("keyup", function (e) {
      var input = $(e.target);

      if (input.val().trim() !== "") {
        $(".reset-search-svg").show();
      } else {
        $(".reset-search-svg").hide();
      }

      filterShops(input.val());
    });

    $(".reset-search-svg").on("click", function () {
      filterInput.val("");
      filterShops("");
      $(".reset-search-svg").hide();
    });
  }

  function enableMapItem(itemId) {
    disableAllExcept([itemId]);

    var kiosk = $(".tab-content").data("kiosk-id");

    if (kiosk > 0) {
      $(".map-kiosks").each(function () {
        var kioskLayout = $(this);
        if (kioskLayout.hasClass("active")) {
          kioskLayout.removeClass("active");
        }
        $(this)
          .find("path")
          .each(function () {
            var pathLayout = $(this);
            if (pathLayout.hasClass("active")) {
              pathLayout.removeClass("active");
            }
          });
      });
    }
  }

  function enableAllMapItems() {
    $("*[data-disabled]").attr("data-disabled", "false");
  }

  function disableAllMapItems() {
    $("*[data-disabled]").attr("data-disabled", "true");
  }

  function disableAllExcept(itemIdArr) {
    $("*[data-disabled]").attr("data-disabled", "true");

    for (var itemId of itemIdArr) {
      var shopId = (itemId[0] === "s" ? itemId.substring(1) : itemId)
        .toLowerCase()
        .replace(/ /g, "");

      $(`*[id^=s${shopId}_],*[id^=s${shopId.toUpperCase()}_]`).attr(
        "data-disabled",
        "false"
      );
    }
  }

  function highlightShop(shopId) {
    if (shopId && mapShops[shopId]) {
      var shopId = mapShops[shopId].shop_code.toLowerCase().replace(/ /g, "");

      $(`*[id^=s${shopId}_], *[id^=s${shopId.toUpperCase()}_]`).toggleClass(
        "highlight"
      );
    }
  }

  function updatePopover(el, shopId, content = "") {
    var shopItem = mapShops[shopId.toLowerCase()];
    if (shopItem) {
      shopId = shopId.toLowerCase();

      var isKiosk = $(".is-kiosk-map");
      var popoverHtml = "";
      if (content == "") {
        popoverHtml =
          '<span class="popover-header" style="background-color:' +
          (shopItem.categories.length
            ? shopItem.categories[0].color
            : disabledColor) +
          ';">' +
          mapShops[shopId].name +
          "</span>";
        if (mapShops[shopId].img_src != "") {
          popoverHtml +=
            '<div class="popover-image-wrapper"><img class="popover-logo" src="' +
            mapShops[shopId].img_src +
            '" alt="logo"/></div><span class="popupLink">Přejít na detail</span>';
        }
        if (isKiosk.length) {
          popoverHtml += '<div class="popover-close">x</div>';
          popoverHtml +=
            '<button class="btn btn-primary default-font-extrabold py-3 px-4 justify-content-center border-rd-14 button-kiosk" onclick="kioskFindPath(this)" data-belongs-to="' +
            shopId.toUpperCase().replace("S", "#map-item-") +
            '">NAVIGOVAĹ¤</button>';
          popoverHtml +=
            '<a class="btn primary-text default-font-medium px-0 py-2 text-left arrow-right arrow-lg custom-font-size-btn text-uppercase" href="' +
            mapShops[shopId].link +
            '"">VIAC INFO</a>';
        }
        el.attr("data-belongs-to", shopId);
      } else {
        el.addClass("min-popover");
        popoverHtml +=
          '<img src="/themes/borymall/assets/imgs/svg/icons/location-primary.svg" alt="location" class="img-fluid popover-icon" />';
        popoverHtml += '<span class="popover-text">' + content + "</span>";
      }
      el.html(popoverHtml);

      setTimeout(function () {
        el.addClass("show");
        updatePopoverPosition();
      }, 50);

      var currentUrl = new URL(window.location.href);
      var params = new URLSearchParams(currentUrl.search);
      if (params.has("navigate")) {
        var navigateAttribute = params.get("navigate");
        if (navigateAttribute === "true") {
          params.delete("navigate");
          currentUrl.search = params.toString();
          window.history.pushState({}, "", currentUrl.href);
          el.find(".button-kiosk").click();
        }
      } else {
        setTimeout(function () {
          el.addClass("show");
          updatePopoverPosition();
        }, 50);
      }
    }
    var buttonClosePopup = $(".popover-close");

    if (buttonClosePopup.length) {
      buttonClosePopup.on("click", function () {
        resetFilters();
      });
    }
  }

  function kioskFindPath(el) {
    var floor = 1;
    var kiosk = $(".tab-content").data("kiosk-id");
    var itemId = $(el).data("belongs-to");

    var itemIdCheck = itemId.replace("#map-item-", "");

    var getFloor = $(".mapshowshops").find(
      "[data-shop-id='" + itemIdCheck.toLowerCase() + "']"
    );

    if (itemIdCheck.replace(/\D/g, "") > 115) {
      floor = 2;
    }

    if (itemIdCheck.replace(/\D/g, "") < 0) {
      floor = 0;
    }

    if (getFloor.length > 0) {
      floor = getFloor.data("shop-floor");
    }

    var kioskId = "kiosk-" + kiosk;

    if (floor === 2 && kiosk <= 4) {
      switch (kiosk) {
        case 1:
          kioskId = "kiosk-9";
          break;
        case 2:
          kioskId = "kiosk-6";
          break;
        case 3:
          kioskId = "kiosk-7";
          break;
        case 4:
          kioskId = "kiosk-8";
          break;
      }
      $(".alert-p-2").show();
    }

    if (floor === 1 && kiosk >= 5) {
      switch (kiosk) {
        case 5:
          kioskId = "kiosk-1";
          break;
        case 6:
          kioskId = "kiosk-2";
          break;
        case 7:
          kioskId = "kiosk-3";
          break;
        case 8:
          kioskId = "kiosk-4";
          break;
        case 9:
          kioskId = "kiosk-1";
          break;
      }
      $(".alert-p-1").show();
    }

    $("#" + kioskId + "-item, [id^=" + kioskId + "-item_]").show();

    if (floor === 0 && kiosk >= 1) {
      $(".alert-p-garage").show();
    }

    if (kiosk > 0) {
      $(hideInfoElementsSelectors.join(",")).addClass("hide");

      $("#floor1 .active, #floor2 .active").each(function () {
        $(this).removeClass("active");
      });

      var trace = $("#floor" + floor + " *[id^=" + kioskId + "]");

      trace.addClass("active");
      trace
        .find(
          "path[id^=" + itemId.substring(1) + "_],path#" + itemId.substring(1)
        )
        .addClass("active");
    }

    clearPopover();
    $("#filtered-shops-alert").hide();
  }

  function getOffset(element) {
    var rect = element.getBoundingClientRect();
    var win = element.ownerDocument.defaultView;
    return {
      top: rect.top + win.pageYOffset,
      left: rect.left + win.pageXOffset,
    };
  }

  function updatePopoverPosition() {
    $(".shop-popover").each(function (index, el) {
      if ($(el).attr("data-belongs-to")) {
        var shopId = (
          $(el).attr("data-belongs-to")[0].toLowerCase() === "s"
            ? $(el).attr("data-belongs-to").substring(1)
            : $(el).attr("data-belongs-to")
        ).toLowerCase();

        var pointsToEl = $(
          '#floor-map *[id^="s' +
            shopId +
            '_1"], #floor-map *[id^="s' +
            shopId.toUpperCase() +
            '_1"]'
        );

        if (
          $("#shops-map-page").length &&
          !$(el).hasClass("general-shop-popover")
        ) {
          var currentActiveTab = $("#map-floor-tabs a.active").first();
          if (
            mapShops[$(el).attr("data-belongs-to")].floorid !=
            currentActiveTab.data("floor")
          ) {
            $(el).removeClass("show");
          } else {
            $(el).addClass("show");
          }
        }

        if (pointsToEl.length === 0) {
          return;
        }

        var needSwap = getOffset(pointsToEl[0]).top;

        var customTop = 25;
        var newCalc =
          getOffset(pointsToEl[0]).top -
          $(el).height() +
          pointsToEl[0].getBoundingClientRect().height / 2 -
          customTop;

        if (isTouchDevice()) {
          if ($(el).hasClass("arrow-flip")) {
            $(el).removeClass("arrow-flip");
          }
          if (needSwap < 300) {
            customTop = -($(el).height() / 2) - 10;
            newCalc =
              getOffset(pointsToEl[0]).top +
              (pointsToEl[0].getBoundingClientRect().height - $(el).height()) /
                2 -
              customTop;
            $(el).addClass("arrow-flip");
          }
        }

        $(el).css("top", newCalc);
        $(el).css(
          "left",
          getOffset(pointsToEl[0]).left +
            (pointsToEl[0].getBoundingClientRect().width - $(el).width()) / 2
        );

        setTimeout(function () {
          $(el).css("visiblity", "visible");
        }, 50);
      }
    });
  }

  function clearPopover() {
    $(".shop-popover:not(.general-shop-popover)").each(function (index, el) {
      var pointsToEl = $(
        "#floor-map *[id^=" + $(el).attr("data-belongs-to") + "]"
      );
      pointsToEl.removeClass("pinned");
      $(el).remove();
    });
  }

  function pinPopover(shopId, content = "") {
    $("#disable-selection").removeClass("display-hidden");

    // Получаем объект магазина по его ID
    var shop = mapShops[shopId.toLowerCase()];
    var tag = shop.link ? "a href='#'" : "div class='notLink shop-popover' "; // Используем <a> если есть link, иначе <div>

    // Создаем HTML для нового popover элемента
    var newShopPopoverHtml =
      "<" +
      tag +
      ' data-belongs-to="' +
      shopId +
      '" class="shop-popover"></' +
      tag +
      ">";

    // Добавляем элемент на карту
    $("#floor-map").append(newShopPopoverHtml);

    var el = $(
      '.shop-popover:not(.general-shop-popover)[data-belongs-to="' +
        shopId +
        '"]'
    );
    updatePopover(el, shopId, content);
    var pointsToEl = $('#floor-map *[id^="' + shopId + '_1"]');
    pointsToEl.addClass("pinned");
    clearPopoverInfoIcon();
    updatePopoverPosition();
  }

  $(window).on("resize", function () {
    updatePopoverPosition();
  });

  if (!isTouchDevice()) {
    var selector = Object.keys(mapShops)
      .map(function (el, index) {
        return (
          "*[id^=s" +
          el.substring(1).toLocaleLowerCase() +
          "_1_],*[id^=s" +
          el.substring(1).toLocaleUpperCase() +
          "_1_]"
        );
      })
      .join(",");

    $(selector).on("mouseenter", function () {
      if (!$(this).hasClass("disabled") && !$(this).hasClass("pinned")) {
        var shopId = $(this).attr("id").split("_")[0];

        highlightShop(shopId);

        updatePopover($(".general-shop-popover"), shopId);
      }
    });

    $(selector).on("mousemove", function (e) {
      if (!$(this).hasClass("disabled") && !$(this).hasClass("pinned")) {
        $(".general-shop-popover").css(
          "top",
          e.pageY - $(".general-shop-popover").height() - 25
        );
        $(".general-shop-popover").css(
          "left",
          e.pageX - $(".general-shop-popover").width() / 2
        );
      }
    });

    $(selector).on("mouseleave", function (e) {
      if (!$(this).hasClass("disabled")) {
        var shopId = $(this).attr("id").split("_")[0];

        highlightShop(shopId);

        setTimeout(function () {
          $(
            '.general-shop-popover[data-belongs-to="' + shopId + '"]'
          ).removeClass("show");
        }, 50);
      }
    });
  }

  $("#floor-map *[id*=_1_]").on("click", function (e) {
    e.preventDefault();
    if (!isTouchDevice()) {
      if ($(this).attr("data-disabled") === "false") {
        var shopId = $(this).attr("id").split("_")[0];

        Object.keys(mapShops).forEach(function (key) {
          if (key.toLowerCase() === shopId.toLowerCase()) {
            if (mapShops[key].link != "#") {
              setTimeout(function () {
                document.location.href = mapShops[key].link;
              }, 250);
            }
          }
        });
      }
    } else {
      var shopId = $(this).attr("id").split("_")[0].substring(1).toLowerCase();

      console.log(shopId);
      $("#map-search-shop").val(shopId).change();

      updatePopoverPosition();
    }
  });

  if (!isTouchDevice()) {
    $("[id^=info-icon]:not(.disabled)").on("mouseenter", function () {
      if (!$(this).hasClass("pinned")) {
        updatePopoverInfoIcon($(".general-info-icon"), $(this).attr("id"));
      }
    });

    $("[id^=info-icon]:not(.disabled)").on("mousemove", function (e) {
      if (!$(this).hasClass("pinned")) {
        $(".general-info-icon").css(
          "top",
          e.pageY - $(".general-info-icon").height() - 25
        );
        $(".general-info-icon").css(
          "left",
          e.pageX - $(".general-info-icon").width() / 2
        );
      }
    });

    $("[id^=info-icon]:not(.disabled)").on("mouseleave", function (e) {
      var popoverId = $(".general-info-icon").attr("data-belongs-to");

      $('.general-info-icon[data-belongs-to="' + popoverId + '"]').removeClass(
        "show"
      );
    });
  } else {
    $("[id^=info-icon]:not(.disabled)").on("click", function (e) {
      clearPopoverInfoIcon();
      resetFilters();

      var clickedItem = $(this);

      pinPopoverInfoIcon(clickedItem.attr("id"));
    });
  }

  function clearPopoverInfoIcon() {
    $(".info-icon-popover:not(.general-info-icon)").each(function (index, el) {
      var pointsToEl = $(
        '.floor-signs-icons g[id="' + $(el).attr("data-belongs-to") + '"]'
      );
      pointsToEl.removeClass("pinned");
      $(el).remove();
    });
  }

  function pinPopoverInfoIcon(iconId, content = "") {
    var newShopPopoverHtml =
      '<a href="#" data-belongs-to="' +
      iconId +
      '" class="info-icon-popover"></a>';
    $("#floor-map").append(newShopPopoverHtml);
    var el = $(
      '.info-icon-popover:not(.general-info-icon)[data-belongs-to="' +
        iconId +
        '"]'
    );
    updatePopoverInfoIcon(el, iconId, content);

    var pointsToEl = $('.floor-signs-icons g[id="' + iconId + '"]');
    pointsToEl.addClass("pinned");

    updatePopoverPositionInfoIcon();
  }

  function updatePopoverInfoIcon(el, iconId, content = "") {
    var infoIconsArray = [
      {
        id: 1,
        name_cs: "ATM - bankomat",
        name_en: "ATM",
      },
      {
        id: 2,
        name_cs: "Výtah",
        name_en: "Lift",
      },
      {
        id: 3,
        name_cs: "Eskalátor",
        name_en: "Escalator",
      },
      {
        id: 4,
        name_cs: "Směnárna",
        name_en: "Exchange",
      },
      {
        id: 5,
        name_cs: "Infopult",
        name_en: "Infopoint",
      },
      {
        id: 6,
        name_cs: "Toalety",
        name_en: "Toilets",
      },
      {
        id: 7,
        name_cs: "Toalety pro vozíčkáře",
        name_en: "Accessible toilets",
      },
      {
        id: 8,
        name_cs: "Food court",
        name_en: "Food Court",
      },
      {
        id: 9,
        name_cs: "Dětské hřiště",
        name_en: "Kid’s Zone",
      },

      {
        id: 11,
        name_cs: "Foto automat",
        name_en: "Photo",
      },

      {
        id: 12,
        name_cs: "Parkovací automat",
        name_en: "Parking",
      },

      {
        id: 13,
        name_cs: "Nabíječka elektromobilů",
        name_en: "Electric cars charging area",
      },
      {
        id: 24,
        name_cs: "Bankomat",
        name_en: "Cash machine",
      },
      {
        id: 25,
        name_cs: "Kuřácká zóna",
        name_en: "Smoking area",
      },
      {
        id: 26,
        name_cs: "Lékárna",
        name_en: "Pharmacy",
      },
      {
        id: 27,
        name_cs: "Kino",
        name_en: "Cinema",
      },
    ];

    if (iconId) {
      var isKiosk = $(".is-kiosk-map");
      var popoverHtml = "";

      var icon = infoIconsArray.find(function (icon) {
        return iconId.startsWith("info-icon-" + icon.id + "-");
      });

      if (content == "" && icon) {
        var title = currentLanguage === "cs" ? icon.name_cs : icon.name_en;

        popoverHtml =
          '<span class="popover-header" style="background-color:#3C1211;">' +
          title +
          "</span>";

        if (isKiosk.length) {
          popoverHtml += '<div class="popover-close">x</div>';
        }

        popoverHtml +=
          '<span class="popover-text" style="padding-top:5px">' +
          title +
          "</span>";

        el.attr("data-belongs-to", iconId);
      }

      el.html(popoverHtml);
      el.addClass("show");

      updatePopoverPositionInfoIcon();
    }

    var buttonClosePopup = $(".popover-close");

    if (buttonClosePopup.length) {
      buttonClosePopup.on("click", function () {
        resetFilters();
      });
    }
  }
  function updatePopoverPositionInfoIcon() {
    $(".info-icon-popover").each(function (index, el) {
      if ($(el).attr("data-belongs-to")) {
        $(el).css("visiblity", "hidden");
        var pointsToEl = $(
          '#floor-map *[id="' + $(el).attr("data-belongs-to") + '"]'
        );

        var needSwap = getOffset(pointsToEl[0]).top;

        var customTop = 25;
        var newCalc =
          getOffset(pointsToEl[0]).top -
          $(el).height() +
          pointsToEl[0].getBoundingClientRect().height / 2 -
          customTop;

        if (isTouchDevice()) {
          if ($(el).hasClass("arrow-flip")) {
            $(el).removeClass("arrow-flip");
          }
          if (needSwap < 200) {
            customTop = -($(el).height() / 2) - 10;
            newCalc =
              getOffset(pointsToEl[0]).top +
              (pointsToEl[0].getBoundingClientRect().height - $(el).height()) /
                2 -
              customTop;
            $(el).addClass("arrow-flip");
          }
        }

        $(el).css("top", newCalc);
        $(el).css(
          "left",
          getOffset(pointsToEl[0]).left +
            (pointsToEl[0].getBoundingClientRect().width - $(el).width()) / 2
        );

        setTimeout(function () {
          $(el).css("visiblity", "visible");
        }, 50);
      }
    });
  }

  function resetFilters(skipSelect) {
    clearPopover();
    clearPopoverInfoIcon();
    resetPanZoom();
    enableAllMapItems();

    //Reset filter button
    filterInput.val("");
    filterShops("");
    $(".reset-search-svg").hide();

    $("#disable-selection").addClass("display-hidden");
    if (!skipSelect) {
      $("#map-search-shop").selectpicker("val", "0");
      $("#map-search-shop")
        .closest(".input-group")
        .find(".search-reset")
        .addClass("hidden");
    }
    $("#map-filter-by-category").selectpicker("val", "0");
    $("#map-filter-by-category")
      .closest(".input-group")
      .find(".search-reset")
      .addClass("hidden");
    $("#map-filter-by-category")
      .siblings(".dropdown-toggle")
      .removeClass("arrow-disabled");

    var floorStatic = $(".floor-signs-icons");

    if (floorStatic.length) {
      floorStatic.each(function () {
        if ($(this).hasClass("hidden")) {
          $(this).removeClass("hidden");
        }
      });
    }

    $("path[id^=map-item-].active, [id^=kiosk-].active").removeClass("active");

    var alert1 = $(".alert-p-1");
    var alert2 = $(".alert-p-2");
    var alert3 = $(".alert-p-garage");

    if (alert1.length > 0) {
      alert1.hide();
    }
    if (alert2.length > 0) {
      alert2.hide();
    }
    if (alert3.length > 0) {
      alert3.hide();
    }
  }

  $("#map-filter-by-category").on("change", function () {
    var val = $(this).val();
    resetFilters();

    if (val == "0") {
      $(this).closest(".input-group").find(".search-reset").addClass("hidden");
      $(this).siblings(".dropdown-toggle").removeClass("arrow-disabled");
    } else {
      $("#map-filter-by-category").selectpicker("val", val);
      var shopsArr = $(this)
        .find('option[value="' + val + '"]')
        .data("shops")
        .split(";");
      for (var i = 0; i < shopsArr.length; i++) {
        shopsArr[i] = "s" + shopsArr[i].toLowerCase();
      }
      disableAllExcept(shopsArr);
      if ($(this).closest(".input-group").find(".search-reset").length == 0) {
        $(this)
          .closest(".input-group")
          .append('<span class="search-reset"></span>');
      }
      $(this)
        .closest(".input-group")
        .find(".search-reset")
        .removeClass("hidden");
      $(this).siblings(".dropdown-toggle").addClass("arrow-disabled");
    }
  });

  var hash = window.location.hash;

  if (hash) {
    // Waiting when main svg map loaded
    var mapLoadedInterval = setInterval(function () {
      var selectedMap = $(".tab-pane.show");

      if (selectedMap.length > 0) {
        clearInterval(mapLoadedInterval);

        // Waiting when change floor buttons loaded
        var changeButtonLoadedInterval = setInterval(function () {
          var val = hash.slice(1);

          $("#map-search-shop").selectpicker("val", val);
          val = "s" + val.toLowerCase();
          mapId = mapShops[val].floorid;

          var changeFloorButton = $(
            '#map-floor-tabs a[data-floor="' + mapId + '"]'
          );

          if (changeFloorButton.length > 0) {
            clearInterval(changeButtonLoadedInterval);

            // Change map action
            $('#map-floor-tabs a[data-floor="' + mapId + '"]').tab("show");

            // Waiting on reload map
            var changeMapInterval = setInterval(function () {
              var selectedMap = $(".tab-pane.show");
              var selectedMapId = null;

              if (selectedMap.length > 0) {
                var selectedMapIdName = selectedMap.attr("id");
                selectedMapId = parseInt(
                  selectedMapIdName.replace(/floor|-map/g, "")
                );
              }

              // Wait for load new map
              if (
                (selectedMap.length > 0 && selectedMapId === mapId) ||
                mapId === 0
              ) {
                clearInterval(changeMapInterval);
                disableAllExcept([val]);

                pinPopover(val);

                if (
                  $(this).closest(".input-group").find(".search-reset")
                    .length == 0
                ) {
                  $(this)
                    .closest(".input-group")
                    .append('<span class="search-reset"></span>');
                }

                $(this)
                  .closest(".input-group")
                  .find(".search-reset")
                  .removeClass("hidden");
              }
            }, 50);
          }
        }, 50);
      }
    }, 50);
  }

  $("#map-search-shop").on("change", function () {
    var val = $(this).val();
    if (val == "0") {
      $(this).closest(".input-group").find(".search-reset").addClass("hidden");
      resetFilters();
    } else {
      $("#map-search-shop").selectpicker("val", val);
      val = "s" + val.toLowerCase();

      $tabHeader = $(
        '#map-floor-tabs a[data-floor="' + mapShops[val].floorid + '"]'
      );
      $tabHeader.tab("show");

      setTimeout(function () {
        resetFilters(true);
        $(hideInfoElementsSelectors.join(",")).removeClass("hide");
        disableAllExcept([val]);
        pinPopover(val);
      }, 100);

      if ($(this).closest(".input-group").find(".search-reset").length == 0) {
        $(this)
          .closest(".input-group")
          .append('<span class="search-reset"></span>');
      }
      $(this)
        .closest(".input-group")
        .find(".search-reset")
        .removeClass("hidden");
    }
  });

  $("body").on("click", ".search-reset", function (e) {
    e.preventDefault();
    e.stopPropagation();
    resetFilters();
  });

  $('#map-floor-tabs a[data-toggle="tab"]').on(
    "shown.bs.tab",
    function (event) {
      updatePopoverPosition();
    }
  );

  $('#map-floor-tabs a[data-toggle="tab"]').on("click", function (event) {
    $(hideInfoElementsSelectors.join(",")).removeClass("hide");
    resetFilters();
  });

  $("body").on("click", ".shop-popover", function (e) {
    var isKiosk = $(".is-kiosk-map");
    if (!isKiosk.length) {
      e.preventDefault();
      if ($(this).attr("data-belongs-to") != "null") {
        var shopId = $(this)
          .attr("data-belongs-to")
          .toLowerCase()
          .replace("#map-item-", "s");
        if (mapShops[shopId].link != "#") {
          setTimeout(function () {
            document.location.href = mapShops[shopId].link;
          }, 250);
        }
      }
    }
  });
  $(document).on("click", function (e) {
    var popover = $(".shop-popover");
    if (!$(e.target).closest(popover).length && popover.is(":visible")) {
      resetFilters();
    }
  });
  if ($("#shops-map-page").length) {
    // pan and zome
    var eventsHandler;
    eventsHandler = {
      haltEventListeners: [
        "touchstart",
        "touchend",
        "touchmove",
        "touchleave",
        "touchcancel",
      ],
      init: function (options) {
        var instance = options.instance,
          initialScale = 1,
          pannedX = 0,
          pannedY = 0;
        // Init Hammer
        // Listen only for pointer and touch events
        this.hammer = Hammer(options.svgElement, {
          inputClass: Hammer.SUPPORT_POINTER_EVENTS
            ? Hammer.PointerEventInput
            : Hammer.TouchInput,
        });
        // Enable pinch on web
        if (isTouchDevice() && !$(".is-kiosk-map").length) {
          this.hammer.get("pinch").set({ enable: true });
          // Handle double tap
          this.hammer.on("doubletap", function (ev) {
            instance.zoomIn();
          });
          this.hammer.on("panstart panmove", function (ev) {
            // On pan start reset panned variables
            if (ev.type === "panstart") {
              pannedX = 0;
              pannedY = 0;
            }
            // Pan only the difference
            instance.panBy({
              x: ev.deltaX - pannedX,
              y: ev.deltaY - pannedY,
            });
            pannedX = ev.deltaX;
            pannedY = ev.deltaY;
          });

          // Handle pinch
          this.hammer.on("pinchstart pinchmove", function (ev) {
            // On pinch start remember initial zoom
            if (ev.type === "pinchstart") {
              initialScale = instance.getZoom();
              instance.zoomAtPoint(initialScale * ev.scale, {
                x: ev.center.x,
                y: ev.center.y,
              });
            }
            const el = ev.target;
            const rect = el.getBoundingClientRect();

            const pos = {
              x: ev.center.x - rect.left,
              y: ev.center.y - rect.top,
            };

            instance.zoomAtPoint(initialScale * ev.scale, {
              x: pos.x,
              y: pos.y,
            });
          });
          // Prevent moving the page on some devices when panning over SVG
          options.svgElement.addEventListener("touchmove", function (e) {
            e.preventDefault();
          });
        }
      },
      destroy: function () {
        if (this.hammer) {
          this.hammer.destroy();
        }
      },
    };

    beforePan = function (oldPan, newPan) {
      var stopHorizontal = false,
        stopVertical = false,
        gutterWidth = 200,
        gutterHeight = 200,
        sizes = this.getSizes(),
        leftLimit =
          -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) +
          gutterWidth,
        rightLimit =
          sizes.width - gutterWidth - sizes.viewBox.x * sizes.realZoom,
        topLimit =
          -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) +
          gutterHeight,
        bottomLimit =
          sizes.height - gutterHeight - sizes.viewBox.y * sizes.realZoom;

      customPan = {};
      customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x));
      customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y));

      return customPan;
    };

    var panZoom;

    function setMap(map) {
      $(".spinner-wrapper").removeClass("done");
      if (currentMap !== map) {
        if (panZoom) {
          panZoom.destroy();
        }

        var isKiosk = $(".is-kiosk-map");

        panZoom = svgPanZoom("#" + map + " svg", {
          animationTime: 1000,
          zoomEnabled: !isKiosk.length,
          controlIconsEnabled: !isKiosk.length,
          panEnabled: !isKiosk.length,
          dblClickZoomEnabled: !isKiosk.length,
          fit: 1,
          center: 1,
          customEventsHandler: eventsHandler,
          beforePan: beforePan,
          minZoom: 1,
          maxZoom: 5,
          onPan: function () {
            updatePopoverPosition();
            updatePopoverPositionInfoIcon();
          },
          onZoom: function () {
            updatePopoverPosition();
            updatePopoverPositionInfoIcon();
          },
        });

        resetPanZoom();

        currentMap = map;
      }

      if ($(window).width() > 1024 || $("#is-kiosk-map").length) {
        disablePanZoom(panZoom);
      } else {
        if (!$("#is-kiosk-map")) {
          enablePanZoom(panZoom);
        }
      }

      $(".shops-map svg style").prop("disabled", true);
      $("#" + map + " svg style").prop("disabled", false);

      $(".temporary-hidden").removeClass("temporary-hidden");
      $(".spinner-wrapper").addClass("done");
    }

    setMap("floor1-map");

    $("#map-floor-tabs #garage-map-tab").on("shown.bs.tab", function (event) {
      setMap("garage-map");
    });

    $("#map-floor-tabs #floor1-map-tab").on("shown.bs.tab", function (event) {
      setMap("floor1-map");
    });

    $("#map-floor-tabs #floor2-map-tab").on("shown.bs.tab", function (event) {
      setMap("floor2-map");
    });

    function resetPanZoom() {
      panZoom.resize();
      panZoom.fit();
      panZoom.center();
    }

    function enablePanZoom(el) {
      if (el) {
        el.enablePan();
        el.enableZoom();
        el.enableControlIcons();
        el.enableDblClickZoom();
        el.enableMouseWheelZoom();
        el.setMinZoom(1);
        el.setMaxZoom(5);
        el.reset();
        el.fit();
        el.center();
      }
    }

    function disablePanZoom(el) {
      var isKiosk = $(".is-kiosk-map");
      if (el) {
        el.disableZoom();
        el.disableControlIcons();
        el.disableDblClickZoom();
        el.disableMouseWheelZoom();
        el.setMinZoom(1);
        el.setMaxZoom(1);
        el.reset();
        el.fit();
        el.center();
        if (!isKiosk.length) {
          el.disablePan();
        }
      }
    }

    if (!$("#is-kiosk-map")) {
      var pageWidth = 0;
      $(window).resize(function () {
        if ($(window).width() > 1024 && pageWidth <= 1024) {
          disablePanZoom(panZoom);
        } else if ($(window).width() < 1024 && pageWidth >= 1024) {
          enablePanZoom(panZoom);
        }
        if ($(window).width() != pageWidth) {
          // resetPanZoom();
          pageWidth = $(window).width();
        }
      });
    }
  }

  $("#disable-selection").on("click", function () {
    resetFilters();
    $(hideInfoElementsSelectors.join(",")).removeClass("hide");
  });
}
