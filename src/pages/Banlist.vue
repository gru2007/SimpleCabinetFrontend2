<template>
    <q-page>
        <q-list>
            <ban-card :value="item" :key="item.id" v-for="item in items">

            </ban-card>
        </q-list>
        <q-pagination v-model="currentPage" :max="maxPages"></q-pagination>
    </q-page>
</template>
  
<script>
import { useQuasar } from "quasar";
import { computed, defineComponent, ref, watch } from "vue";
import { useStore, mapState } from "vuex";
import BanCard from 'src/components/BanCard.vue';

export default defineComponent({
    components: { BanCard },
    name: 'PageBanlist',
    setup(props) {
        const $store = useStore();
        const $q = useQuasar();
        var items = ref([]);
        var maxPages = ref(1);
        var currentPage = ref(1);
        async function fetchItems(page) {
            return await $store.dispatch("api/request", {
                url: "banlist/page/" + page,
                method: "GET",
            });
        };
        fetchItems(0).then((v) => {
            if (v.ok) {
                items.value = v.data.data;
                console.log(v.data);
                maxPages.value = v.data.totalPages;
                currentPage.value = 1;
            }
        });
        return {
            fetchItems,
            items,
            currentPage,
            maxPages
        }
    }
})
</script>
  