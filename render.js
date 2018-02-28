(() => {

	function testPageLength ($pages) {
		$pages.children().each(function (ind) {
			console.log('page test ' + ind + ' - ', $(this).height())
		})
	}

	function init (md) {
		const $pages = $('<div id="pages"></div>')

		const pageHeight = 700

		const $tm = $(marked(md))

		// append $pages to app 
		$('#app').append($pages)

		function buildApage ($tmArray, test) {
			// if $tmArray is empty stop
			if (!$tmArray.length) {
				testPageLength($pages)
				$pages.children().each(function () {
					$(this).css({height: '700px'})
				})
				return 
			}	

			// create a page element
			const $page = $('<div class="page"></div>')

			// append page to pages
			$pages.append($page)

			// switch in case a page break is found
			let pageBreakFound = false

			// add elements to page while page is less than pageHeight or until a page break is found.
			while ($page.height() < pageHeight && $tmArray.length && !pageBreakFound) {
				const $eleToAdd = $($tmArray.shift())
				if ($eleToAdd.is('hr')) {
					pageBreakFound = true
				} else {
					$page.append($eleToAdd)
				}
			}

			// if page height is longer or equal remove last element and add it to beginning of tmArray
			if ($page.height() >= pageHeight && $tmArray.length) {
				const $lastChild = $page.children().last().remove()
				$tmArray.unshift($lastChild)
			}

			buildApage($tmArray)
		}
		buildApage($tm.toArray())
	}

	function processMd (blob) {
    return atob(blob)
	}

	axios.get('https://api.github.com/repos/duncannevin/md_renderer/readme')
    .then(res => res.data.content)
    .then(processMd)
    .then(init) 
    .catch(console.error)

})(window)