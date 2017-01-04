const VueEvents = {
    install (Vue) {
        Vue.prototype.EventBus = new Vue();
    }
};

export default VueEvents;
