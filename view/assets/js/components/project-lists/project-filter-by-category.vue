<template>
	<form action="" method="get" class="cpm-project-filters" id="cpm-project-filters">
        <select name="project_cat" id="project_cat" class="">
			<option value="-1" selected="selected">– Project Category –</option>
		</select>
        <input type="hidden" name="p" value="">
        <input type="hidden" name="status" value="">
        <input type="hidden" name="page" value="cpm_projects">
        <input type="submit" name="submit" id="project-filter-submit" class=" cpm-btn-submit cpm-btn-blue" value="Filter">
    </form>
</template>