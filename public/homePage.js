const logoutButton = new LogoutButton();
logoutButton.action = () => {
    ApiConnector.logout(response => {
        if (response.success) {
            location.reload();
        };
    });
};

ApiConnector.current(response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    };
});

const ratesBoard = new RatesBoard();

const getRatesBoard = () => {
    ApiConnector.getStocks(response => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        };
    });
};

getRatesBoard();

let ratesBoardIntervalId = setInterval(getRatesBoard, 60000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
        };
        moneyManager.setMessage(response.success, response.error || `${data.amount} ${data.currency} добавлены на счет`);
    });
};

moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
        };
        moneyManager.setMessage(response.success, response.error || `${data.fromAmount} ${data.fromCurrency} сконвертированы в ${data.targetCurrency}`);
    });
};

moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
        };
        moneyManager.setMessage(response.success, response.error || `${data.amount} ${data.currency} переведены пользователю с ID ${data.to}`);
    });
};

const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites(response => {
    if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    };
});

favoritesWidget.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        };
       favoritesWidget.setMessage(response.success, response.error || `Пользователь ${data.name} (ID ${data.id}) добавлен в избранное`);
    });
};

favoritesWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        };
        favoritesWidget.setMessage(response.success, response.error || `Пользователь ID ${data} удален из избранного`);      
    });
};