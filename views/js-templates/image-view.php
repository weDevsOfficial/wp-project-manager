<a  target="_new" v-bind:class="{'cpm-colorbox-img' : file.type !='file'}"  title="{{file.name}}" href="{{file.url}}">
    <img :src="file.thumb" alt="{{file.name}}" />
</a>