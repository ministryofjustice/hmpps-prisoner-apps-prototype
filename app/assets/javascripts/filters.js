$(document).ready(function () {

    console.log('filters.js loaded');
    // Only run if filterable elements exist on the page
    if ($('.filter-container').length === 0 || $('#applications-table').length === 0) {
        console.log('Filterable elements not found, skipping filter initialization');
        return;
    }

    var allApplicationsData = [];
    var departmentsData = [];
    var applicationTypesData = [];
    var sessionApplications = [];

    // Get session applications from template (if passed from server)
    if (typeof window.sessionApplications !== 'undefined') {
        sessionApplications = window.sessionApplications;
        console.log('Session applications loaded:', sessionApplications.length);
    }

    // Load all data files from API routes
    Promise.all([
        $.getJSON('/api/applications').catch(function (error) {
            console.error('Failed to load applications:', error);
            return [];
        }),
        $.getJSON('/api/departments').catch(function (error) {
            console.error('Failed to load departments:', error);
            return [];
        }),
        $.getJSON('/api/application-types').catch(function (error) {
            console.error('Failed to load application types:', error);
            return [];
        })
    ]).then(function (results) {
        console.log('Data loaded successfully');

        // Handle both array and object structures for applications
        if (Array.isArray(results[0])) {
            allApplicationsData = results[0];
        } else if (results[0] && results[0].applications) {
            allApplicationsData = results[0].applications;
        } else if (results[0] && typeof results[0] === 'object') {
            var possibleArrays = Object.values(results[0]).filter(Array.isArray);
            if (possibleArrays.length > 0) {
                allApplicationsData = possibleArrays[0];
            } else {
                console.error('Could not find applications array in:', results[0]);
                allApplicationsData = [];
            }
        } else {
            allApplicationsData = [];
        }

        departmentsData = Array.isArray(results[1]) ? results[1] : [];
        applicationTypesData = Array.isArray(results[2]) ? results[2] : [];

        // Combine API data with session data
        if (sessionApplications.length > 0) {
            allApplicationsData = [...sessionApplications, ...allApplicationsData];
        }

        console.log('Total applications:', allApplicationsData.length);
        console.log('Departments:', departmentsData.length);
        console.log('Application types:', applicationTypesData.length);

        // Initialize the interface
        initializeInterface();

    }).catch(function (error) {
        console.error('Failed to load data:', error);
        // If API fails, try to use session data
        if (sessionApplications.length > 0) {
            allApplicationsData = sessionApplications;
            initializeInterface();
        }
    });

    function convertDateReceived(dateReceived) {
        if (dateReceived === 0 || dateReceived === '0') {
            return new Date().toLocaleDateString('en-GB', {
                day: 'numeric', month: 'numeric', year: 'numeric'
            });
        }

        var today = new Date();
        var daysAgo = Math.abs(parseInt(dateReceived));
        var targetDate = new Date(today);
        targetDate.setDate(today.getDate() - daysAgo);

        var options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        return targetDate.toLocaleDateString('en-GB', options);
    }

    function isFirstNightLocation(priority) {
        return priority === "fnc";
    }

    function getCurrentApplications() {
        var newSelected = $('#status-new').is(':checked');
        var inProgressSelected = $('#status-in-progress').is(':checked');
        var closedSelected = $('#status-closed').is(':checked');
        var includeApproved = $('#status-approved').is(':checked');
        var includeDeclined = $('#status-declined').is(':checked');

        // If none selected, show all
        if (!newSelected && !inProgressSelected && !closedSelected) {
            return allApplicationsData;
        }

        return allApplicationsData.filter(function (app) {
            var status = app.status ? app.status.toLowerCase() : 'new';
            var decision = app.decision ? app.decision.toLowerCase() : '';

            if (newSelected && (status === 'new' || !app.status)) {
                return true;
            }

            if (inProgressSelected && status === 'in progress') {
                return true;
            }

            if (closedSelected && status === 'closed') {
                if (!includeApproved && !includeDeclined) return true;
                if (includeApproved && includeDeclined) return true;
                if (includeApproved && decision === 'approved') return true;
                if (includeDeclined && decision === 'declined') return true;
            }

            return false;
        });
    }
    function displayResults(results) {
        // Update both possible table structures
        var $resultsCount = $('#applications-table .count, #applications-table-closed .count');
        var $resultsTable = $('#applications-table tbody, #applications-table-closed tbody, #results-tbody, #results-tbody-closed');
        var $noResults = $('.applications-table .no-results');
        var $table = $('#applications-table, #applications-table-closed');
        var $caption = $('#applications-table caption, #applications-table-closed caption');

        // Update count in caption
        if ($caption.length) {
            $caption.text('Showing ' + results.length + ' applications');
        }
        if ($resultsCount.length) {
            $resultsCount.text(results.length);
        }

        if (results.length === 0) {
            $table.hide();
            $noResults.show();
            return;
        }

        $table.show();
        $noResults.hide();

        var html = '';
        results.forEach(function (item) {
            var viewUrl = item.app_url || (window.homeurl + '/applications/view/app/application?url_id=' + item.app_id);

            html += '<tr class="govuk-table__row">';
            html += '<td class="govuk-table__cell nowrap">' + convertDateReceived(item.date_received) + '</td>';
            html += '<td class="govuk-table__cell">';
            html += '<div class="application-type">' + item.app_type + '</div>';
            html += '<div class="prisoner-id govuk-table__subtext govuk-body-s">' + item.owner + '</div>';
            html += '</td>';
            html += '<td class="govuk-table__cell">';
            html += '<div class="prisoner-info">';
            html += '<div class="prisoner-name">' + item.prisoner_name + '</div>';
            html += '<div class="prisoner-id govuk-table__subtext govuk-body-s">' + item.prisoner_number + '</div>';
            html += '</div>';
            html += '</td>';
            html += '<td class="govuk-table__cell">';
            var messageCount = 0;
            for (var i = 1; i <= 5; i++) {
                if (item['message_' + i]) messageCount++;
            }
            if (messageCount > 0) {
                html += '<span class="moj-notification-badge">';
                html += '<span aria-hidden="true">' + messageCount + '</span>';
                html += '<span class="govuk-visually-hidden">' + messageCount + ' messages</span>';
                html += '</span>';
            } else {
                html += 'None';
            }
            html += '</td>';
            html += '<td class="govuk-table__cell"><a href="' + viewUrl + '" class="govuk-link">View</a></td>';
        });

        $resultsTable.html(html);
    }

    function initializeInterface() {
        // Ensure pending is selected by default
        if (!$('#status-new').is(':checked') && !$('#status-in-progress').is(':checked') && !$('#status-closed').is(':checked')) {
            $('#status-new').prop('checked', true);
        }

        // Initialize filters and display
        populateDepartments();
        populateApplicationTypes();

        // Initial load with current applications
        var currentApplications = getCurrentApplications();
        displayResults(currentApplications);

        // Initialize filters (which includes event handlers)
        initializeFilters();

        // Show selected filters on page load (including default pending filter)
        updateSelectedFilters();
    }

    function populateDepartments() {
        console.log('=== populateDepartments() called ===');
        var $departmentList = $('.filter-container .department-list');
        if (!$departmentList.length) return;

        // Save currently selected departments before clearing
        var currentlySelected = [];
        $('.filter-container input[name="department"]:checked').each(function () {
            currentlySelected.push($(this).val());
        });
        console.log('Departments currently selected:', currentlySelected);

        $departmentList.empty();

        // Get current filter state (excluding departments to avoid circular filtering)
        var prisonerSearchTerm = $('.filter-container .prisoner-search').val().toLowerCase().trim();
        var selectedApplicationTypes = [];
        var firstNightOnly = $('.filter-container #first-night').is(':checked');

        $('.filter-container input[name="application-type"]:checked').each(function () {
            selectedApplicationTypes.push($(this).val());
        });

        var currentApplications = getCurrentApplications();

        // Apply all filters except department filter
        var filteredApplications = currentApplications.filter(function (item) {
            // Prisoner name/number search
            if (prisonerSearchTerm) {
                var nameMatch = item.prisoner_name && item.prisoner_name.toLowerCase().includes(prisonerSearchTerm);
                var idMatch = item.prisoner_number && item.prisoner_number.toLowerCase().includes(prisonerSearchTerm);
                if (!nameMatch && !idMatch) {
                    return false;
                }
            }

            // First night filter
            if (firstNightOnly && !isFirstNightLocation(item.priority)) {
                return false;
            }

            // Application type filter
            if (selectedApplicationTypes.length > 0 && !selectedApplicationTypes.includes(item.app_type)) {
                return false;
            }

            return true;
        });

        // Count applications per department
        var departmentCounts = {};
        filteredApplications.forEach(function (app) {
            var dept = app.owner || 'Unassigned';
            departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
        });

        // Only show departments that have applications
        var availableDepartments = Object.keys(departmentCounts);
        availableDepartments.sort();

        availableDepartments.forEach(function (deptName) {
            var deptCount = departmentCounts[deptName];
            var deptId = deptName.toLowerCase().replace(/\s+/g, '-');

            var html = '<div class="govuk-checkboxes__item department-item">';
            html += '<input class="govuk-checkboxes__input" id="dept-' + deptId + '" name="department" type="checkbox" value="' + deptName + '"';

            // Only restore selection if this department is still available
            if (currentlySelected.includes(deptName)) {
                html += ' checked';
            }

            html += '>';
            html += '<label class="govuk-label govuk-checkboxes__label" for="dept-' + deptId + '">';
            html += deptName + ' (' + deptCount + ')';
            html += '</label>';
            html += '</div>';

            $departmentList.append(html);
        });

        console.log('Populated departments:', availableDepartments.length, 'available');
    }


    function populateApplicationTypes() {
        console.log('=== populateApplicationTypes() called ===');
        var $applicationTypeList = $('.filter-container .application-type-list');
        if (!$applicationTypeList.length) return;

        // Save currently selected application types before clearing
        var currentlySelected = [];
        $('.filter-container input[name="application-type"]:checked').each(function () {
            currentlySelected.push($(this).val());
        });
        console.log('App types currently selected:', currentlySelected);

        $applicationTypeList.empty();

        // Get current filter state (excluding application types to avoid circular filtering)
        var prisonerSearchTerm = $('.filter-container .prisoner-search').val().toLowerCase().trim();
        var selectedDepartments = [];
        var firstNightOnly = $('.filter-container #first-night').is(':checked');

        $('.filter-container input[name="department"]:checked').each(function () {
            selectedDepartments.push($(this).val());
        });

        console.log('Selected departments for filtering app types:', selectedDepartments);

        var currentApplications = getCurrentApplications();
        console.log('Current applications before department filter:', currentApplications.length);

        // Apply all filters except application type filter
        var filteredApplications = currentApplications.filter(function (item) {
            // Prisoner name/number search
            if (prisonerSearchTerm) {
                var nameMatch = item.prisoner_name && item.prisoner_name.toLowerCase().includes(prisonerSearchTerm);
                var idMatch = item.prisoner_number && item.prisoner_number.toLowerCase().includes(prisonerSearchTerm);
                if (!nameMatch && !idMatch) {
                    return false;
                }
            }

            // First night filter
            if (firstNightOnly && !isFirstNightLocation(item.priority)) {
                return false;
            }

            // Department filter
            if (selectedDepartments.length > 0) {
                var itemDept = item.owner || 'Unassigned';
                console.log('Checking app:', item.app_type, 'in dept:', itemDept, 'against selected:', selectedDepartments);
                if (!selectedDepartments.includes(itemDept)) {
                    return false;
                }
            }

            return true;
        });

        console.log('Filtered applications after department filter:', filteredApplications.length);

        // Count applications per type
        var typeCounts = {};
        filteredApplications.forEach(function (app) {
            var appType = app.app_type;
            if (appType) {
                typeCounts[appType] = (typeCounts[appType] || 0) + 1;
            }
        });

        console.log('Application type counts:', typeCounts);

        // Only show application types that have applications
        var availableTypes = Object.keys(typeCounts);
        availableTypes.sort();

        availableTypes.forEach(function (appType, index) {
            var appTypeCount = typeCounts[appType];
            var appTypeId = 'app-type-' + index;

            var html = '<div class="govuk-checkboxes__item application-type-item">';
            html += '<input class="govuk-checkboxes__input" id="' + appTypeId + '" name="application-type" type="checkbox" value="' + appType + '"';

            // Only restore selection if this application type is still available
            if (currentlySelected.includes(appType)) {
                html += ' checked';
            }

            html += '>';
            html += '<label class="govuk-label govuk-checkboxes__label" for="' + appTypeId + '">';
            html += appType + ' (' + appTypeCount + ')';
            html += '</label>';
            html += '</div>';

            $applicationTypeList.append(html);
        });

        console.log('Populated application types:', availableTypes.length, 'available');
    }

    function getFilteredApplicationsForCounting() {
        var prisonerSearchTerm = $('.filter-container .prisoner-search').val().toLowerCase().trim();
        var selectedDepartments = [];
        var selectedApplicationTypes = [];
        var firstNightOnly = $('.filter-container #first-night').is(':checked');

        $('.filter-container input[name="department"]:checked').each(function () {
            selectedDepartments.push($(this).val());
        });

        $('.filter-container input[name="application-type"]:checked').each(function () {
            selectedApplicationTypes.push($(this).val());
        });

        var currentApplications = getCurrentApplications();

        return currentApplications.filter(function (item) {
            // Prisoner name/number search
            if (prisonerSearchTerm) {
                var nameMatch = item.prisoner_name && item.prisoner_name.toLowerCase().includes(prisonerSearchTerm);
                var idMatch = item.prisoner_number && item.prisoner_number.toLowerCase().includes(prisonerSearchTerm);
                if (!nameMatch && !idMatch) {
                    return false;
                }
            }

            // First night filter
            if (firstNightOnly && !isFirstNightLocation(item.priority)) {
                return false;
            }

            return true;
        });
    }

    function getFilteredApplicationsForDepartments() {
        var prisonerSearchTerm = $('.filter-container .prisoner-search').val().toLowerCase().trim();
        var selectedApplicationTypes = [];
        var firstNightOnly = $('.filter-container #first-night').is(':checked');

        $('.filter-container input[name="application-type"]:checked').each(function () {
            selectedApplicationTypes.push($(this).val());
        });

        var currentApplications = getCurrentApplications();

        return currentApplications.filter(function (item) {
            // Prisoner name/number search
            if (prisonerSearchTerm) {
                var nameMatch = item.prisoner_name && item.prisoner_name.toLowerCase().includes(prisonerSearchTerm);
                var idMatch = item.prisoner_number && item.prisoner_number.toLowerCase().includes(prisonerSearchTerm);
                if (!nameMatch && !idMatch) {
                    return false;
                }
            }

            // First night filter
            if (firstNightOnly && !isFirstNightLocation(item.priority)) {
                return false;
            }

            // Application type filter (when populating departments)
            if (selectedApplicationTypes.length > 0 && !selectedApplicationTypes.includes(item.app_type)) {
                return false;
            }

            return true;
        });
    }

    function getFilteredApplicationsForApplicationTypes() {
        var prisonerSearchTerm = $('.filter-container .prisoner-search').val().toLowerCase().trim();
        var selectedDepartments = [];
        var firstNightOnly = $('.filter-container #first-night').is(':checked');

        $('.filter-container input[name="department"]:checked').each(function () {
            selectedDepartments.push($(this).val());
        });

        var currentApplications = getCurrentApplications();

        return currentApplications.filter(function (item) {
            // Prisoner name/number search
            if (prisonerSearchTerm) {
                var nameMatch = item.prisoner_name && item.prisoner_name.toLowerCase().includes(prisonerSearchTerm);
                var idMatch = item.prisoner_number && item.prisoner_number.toLowerCase().includes(prisonerSearchTerm);
                if (!nameMatch && !idMatch) {
                    return false;
                }
            }

            // First night filter
            if (firstNightOnly && !isFirstNightLocation(item.priority)) {
                return false;
            }

            // Department filter (when populating application types)
            if (selectedDepartments.length > 0) {
                var itemDept = item.owner || 'Unassigned';
                if (!selectedDepartments.includes(itemDept)) {
                    return false;
                }
            }

            return true;
        });
    }

    function restoreSelectedValues(filterType) {
        // This function has been removed - selections are now handled inline
        // to avoid restoring selections that shouldn't exist after cross-filtering
    }

    function saveSelectedValues() {
        // This function has been removed - selections are now handled inline
        // to avoid conflicts with cross-filtering behavior
    }

    function updateSelectedFilters() {
        var $container = $('.filter-container');
        var $prisonerSearch = $container.find('.prisoner-search');
        var $selectedFilters = $container.find('.selected-filters');
        var $selectedTags = $container.find('.selected-tags');

        var selectedFilters = [];

        // Add prisoner search if present
        var prisonerSearchValue = $prisonerSearch.val().trim();
        if (prisonerSearchValue) {
            selectedFilters.push({
                label: 'Prisoner: ' + prisonerSearchValue,
                value: prisonerSearchValue,
                type: 'prisoner'
            });
        }

        // Add status filters only if they are checked
        if ($('#status-new').is(':checked')) {
            selectedFilters.push({
                label: 'New',
                value: 'new',
                fieldset: 'Status',
                type: 'status'
            });
        }
        if ($('#status-in-progress').is(':checked')) {
            selectedFilters.push({
                label: 'In progress',
                value: 'in progress',
                fieldset: 'Status',
                type: 'status'
            });
        }
        if ($('#status-closed').is(':checked')) {
            var closedLabel = 'Closed';
            var subStatuses = [];
            if ($('#status-approved').is(':checked')) subStatuses.push('Approved');
            if ($('#status-declined').is(':checked')) subStatuses.push('Declined');
            if (subStatuses.length > 0) {
                closedLabel += ' (' + subStatuses.join(', ') + ')';
            }
            selectedFilters.push({
                label: closedLabel,
                value: 'closed',
                fieldset: 'Status',
                type: 'status'
            });
        }
        // Add first night if selected
        if ($('#first-night').is(':checked')) {
            selectedFilters.push({
                label: 'First night centre or early days centre',
                value: 'first-night',
                fieldset: 'Priority',
                type: 'checkbox'
            });
        }

        // Add selected checkboxes
        $container.find('input[name="department"]:checked, input[name="application-type"]:checked').each(function () {
            var label = $(this).next('label').text().trim();
            var value = $(this).val();
            var fieldset = $(this).attr('name') === 'department' ? 'Department' : 'Application type';

            selectedFilters.push({
                label: label,
                value: value,
                fieldset: fieldset,
                type: 'checkbox'
            });
        });

        // Update the selected filters display using MoJ pattern
        if (selectedFilters.length > 0) {
            var tagsHtml = '';
            var groupedFilters = {};

            // Group filters by fieldset
            selectedFilters.forEach(function (filter) {
                var fieldset = filter.fieldset || (filter.type === 'prisoner' ? 'Search' : 'Other');
                if (!groupedFilters[fieldset]) {
                    groupedFilters[fieldset] = [];
                }
                groupedFilters[fieldset].push(filter);
            });

            // Build HTML for each group
            Object.keys(groupedFilters).forEach(function (fieldset) {
                tagsHtml += '<h3 class="govuk-heading-s govuk-!-margin-bottom-0">' + fieldset + '</h3>';
                tagsHtml += '<ul class="moj-filter-tags">';

                groupedFilters[fieldset].forEach(function (filter) {
                    tagsHtml += '<li><a class="moj-filter__tag" href="#" data-value="' + filter.value + '" data-type="' + filter.type + '">';
                    tagsHtml += '<span class="govuk-visually-hidden">Remove this filter</span> ';

                    if (filter.type === 'prisoner') {
                        tagsHtml += filter.label;
                    } else if (filter.type === 'checkbox') {
                        // Remove count from label for display
                        tagsHtml += filter.label.split('(')[0].trim();
                    } else {
                        tagsHtml += filter.label;
                    }
                    tagsHtml += '</a></li>';
                });

                tagsHtml += '</ul>';
            });

            $selectedTags.html(tagsHtml);
            $selectedFilters.show();
        } else {
            $selectedFilters.hide();
        }
    }

    function initializeFilters() {
        var $container = $('.filter-container');
        var $prisonerSearch = $container.find('.prisoner-search');
        var $departmentSearch = $container.find('.department-search');
        var $applicationTypeSearch = $container.find('.application-type-search');
        var $selectedFilters = $container.find('.selected-filters');
        var $selectedTags = $container.find('.selected-tags');
        var $applyButtons = $container.find('.apply-filters');
        var $clearButton = $container.find('.clear-filters');

        // Status checkbox change handlers
        $container.on('change', '#status-new, #status-in-progress, #status-closed', function () {            // Show/hide conditional checkboxes when closed is checked
            if ($('#status-closed').is(':checked')) {
                $('#conditional-closed').removeClass('govuk-checkboxes__conditional--hidden');
                $('#conditional-closed').attr('aria-hidden', 'false');
            } else {
                $('#conditional-closed').addClass('govuk-checkboxes__conditional--hidden');
                $('#conditional-closed').attr('aria-hidden', 'true');
                // Uncheck the sub-checkboxes when closed is unchecked
                $('#status-approved, #status-declined').prop('checked', false);
            }
        });

        // Closed sub-status checkboxes
        $container.on('change', '#status-approved, #status-declined', function () {
            // Don't refresh department and application type filters automatically
            // They will be refreshed when apply button is clicked
        });

        // Department search functionality
        $departmentSearch.on('keyup', function () {
            var searchTerm = $(this).val().toLowerCase();
            var hasVisibleItems = false;

            $container.find('.department-item').each(function () {
                var labelText = $(this).find('label').text().toLowerCase();

                if (labelText.includes(searchTerm)) {
                    $(this).show();
                    hasVisibleItems = true;
                } else {
                    $(this).hide();
                }
            });

            var $noResults = $container.find('.no-department-results');
            if (hasVisibleItems || searchTerm === '') {
                $noResults.hide();
            } else {
                $noResults.show();
            }
        });

        // Application type search functionality
        $applicationTypeSearch.on('keyup', function () {
            var searchTerm = $(this).val().toLowerCase();
            var hasVisibleItems = false;

            $container.find('.application-type-item').each(function () {
                var labelText = $(this).find('label').text().toLowerCase();

                if (labelText.includes(searchTerm)) {
                    $(this).show();
                    hasVisibleItems = true;
                } else {
                    $(this).hide();
                }
            });

            var $noResults = $container.find('.no-application-type-results');
            if (hasVisibleItems || searchTerm === '') {
                $noResults.hide();
            } else {
                $noResults.show();
            }
        });

        // Filter checkboxes change handler - removed updateSelectedFilters() call
        $container.on('change', 'input[name="department"], input[name="application-type"], #first-night', function () {
            // Only update filters when apply button is pressed
        });

        // Apply filters buttons
        $applyButtons.on('click', function () {
            // First, update the cross-filtering of available options
            populateDepartments();
            populateApplicationTypes();

            // Then update the filter tags and apply to table
            updateSelectedFilters();
            applyFilters();
        });

        // Clear filters
        $clearButton.on('click', function (e) {
            e.preventDefault();

            // Clear all checkboxes (including status)
            $container.find('input[type="checkbox"]').prop('checked', false);
            $('#conditional-closed').addClass('govuk-checkboxes__conditional--hidden');
            $('#conditional-closed').attr('aria-hidden', 'true');
            $prisonerSearch.val('');
            $departmentSearch.val('');
            $applicationTypeSearch.val('');

            // Reset checkbox visibility
            $container.find('.department-item, .application-type-item').show();
            $container.find('.no-department-results, .no-application-type-results').hide();

            // Refresh filters and apply
            populateDepartments();
            populateApplicationTypes();
            updateSelectedFilters();
            applyFilters();
        });

        // Remove individual filter tags (MoJ pattern)
        $selectedTags.on('click', '.moj-filter__tag', function (e) {
            e.preventDefault();
            var value = $(this).data('value');
            var type = $(this).data('type');

            if (type === 'prisoner') {
                $prisonerSearch.val('');
            } else if (type === 'status') {
                // Uncheck the specific status
                $container.find('input[value="' + value + '"]').prop('checked', false);
                // If unchecking closed, hide conditional section
                if (value === 'closed') {
                    $('#conditional-closed').addClass('govuk-checkboxes__conditional--hidden');
                    $('#conditional-closed').attr('aria-hidden', 'true');
                    $('#status-approved, #status-declined').prop('checked', false);
                }
            } else if (type === 'checkbox') {
                $container.find('input[value="' + value + '"]').prop('checked', false);
            }

            populateDepartments();
            populateApplicationTypes();
            updateSelectedFilters();
            applyFilters();
        });

        function applyFilters() {
            var prisonerSearchTerm = $prisonerSearch.val().toLowerCase().trim();
            var selectedDepartments = [];
            var selectedApplicationTypes = [];
            var firstNightOnly = $container.find('#first-night').is(':checked');

            $container.find('input[name="department"]:checked').each(function () {
                selectedDepartments.push($(this).val());
            });

            $container.find('input[name="application-type"]:checked').each(function () {
                selectedApplicationTypes.push($(this).val());
            });

            var currentApplications = getCurrentApplications();

            var filteredData = currentApplications.filter(function (item) {
                // Prisoner name/number search
                if (prisonerSearchTerm) {
                    var nameMatch = item.prisoner_name && item.prisoner_name.toLowerCase().includes(prisonerSearchTerm);
                    var idMatch = item.prisoner_number && item.prisoner_number.toLowerCase().includes(prisonerSearchTerm);
                    if (!nameMatch && !idMatch) {
                        return false;
                    }
                }

                // First night filter
                if (firstNightOnly && !isFirstNightLocation(item.priority)) {
                    return false;
                }

                // Department filter
                if (selectedDepartments.length > 0) {
                    var itemDept = item.owner || 'Unassigned';
                    if (!selectedDepartments.includes(itemDept)) {
                        return false;
                    }
                }

                // Application type filter
                if (selectedApplicationTypes.length > 0 && !selectedApplicationTypes.includes(item.app_type)) {
                    return false;
                }

                return true;
            });

            displayResults(filteredData);
        }
    }

 addFilter('formatDateTime', (isoString) => {
    if (!isoString) return '—';
    const date = new Date(isoString);
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} ${hours}.${minutes}`;
});   

});


