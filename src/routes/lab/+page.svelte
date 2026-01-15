<script lang="ts">
	import { goto } from "$app/navigation";
	import { sendSMS, supabase, uploadToCloudinary } from "$lib/helper";
	import { registerSchema } from "$lib/schemas/registerSchemas";
	import { pageTitle } from "$lib/stores/title";
	import { Calendar, DateField, DatePicker } from "bits-ui";
	import { Calendar1Icon } from "lucide-svelte";
	import { onMount } from "svelte";

    let nickName = $state('');
    let fullName = $state('');
    let gender = $state('');
    let birthdate = $state(null);
    let rawPhone = $state('')
    let phoneNumber = $state('');
    let medicalInfo = $state('');
    let fitnessGoal = $state('');
    let preferedWorkoutTime = $state('');
    let photo : File |null = $state(null);
    let message = $state('');
    let loadingCloudinary = $state(false);
    let loadingSupabase = $state(false);
    let photoUrl: string | null = $state(null) 
    let paymentMethod = $state('')
    
    async function handleSubmit() {
        const formData = {
            nick_name: nickName,
            full_name: fullName,
            gender: gender,
            birth_date: birthdate,
            phone_number: rawPhone,
            medical_info: medicalInfo,
            fitness_goal: fitnessGoal,
            prefered_workout_time: preferedWorkoutTime,
        }

        const parsed = registerSchema.safeParse(formData)
        if (!parsed.success) {
            message = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0]
            console.log(message)
            return
        }
        if (!photo) {
            message = 'please upload a photo before submitting'
            console.log(message)
            return;
        }
        loadingCloudinary = true;
        loadingSupabase = true
        message = 'Uploading Photo'

        try {
            const uploadRes = await uploadToCloudinary(photo)
            photoUrl = uploadRes.secure_url;

        } catch(err) {
            message = 'image upload fail'
            return;
        } 
        finally {
            loadingCloudinary = false
        }
        if (!photoUrl) return;

        const finalData = {...parsed.data, photo_url: photoUrl}
        console.log(finalData)
        const { data: member, error: memberError } = await supabase.from('Members').insert([
            finalData
        ]).select().single()


        if(memberError || !member) {
            console.log(memberError)
            message= "Member's data upload fail"
            return
        } else {
            console.log(member, memberError)

            const newMemberId = member.member_id;
            const transactionId = `${new Date().toISOString().split("T")[0].replaceAll("-","")}-${newMemberId}`;

            const transactionPayLoad = {
                transaction_id:transactionId,
                member_id: newMemberId,
                membership_types_id: 1,
                transaction_type:"signup",
                amount: 100,
                payment_method: paymentMethod,
                transaction_date: `${new Date().toISOString().split("T")[0]}`,                
            }
            
            const { data: trx, error:trxError } = await supabase.from('Transactions').insert(
                transactionPayLoad
            ).select().single()

            if(trxError || !trx){
                console.log(trxError)
                return
            } else {
                message= "Success!"
                alert(message)
                setTimeout(() =>{
                    goto('/dashboard/success')
                }, 1000)
                loadingSupabase=false
            }
            const membershipExpiration = new Date(transactionPayLoad.transaction_date);
            membershipExpiration.setDate(membershipExpiration.getDate() + 28);

            const smsResult = await sendSMS(phoneNumber,nickName, membershipExpiration, 'register')
            console.log(smsResult)
        }

    }
    let step = $state(2);
    const totalStep = 3;

    function nextStep(){
        if (step<totalStep) step++
    }
    function prevStep(){
        if (step>1) step--
    }
    onMount(() => {
        pageTitle.set('REGISTER')
    })
    function capitalizeName(name: String){
        return name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }    
    function handlePhoneInput(e: any) {
    // Get the current input
    const input = e.target.value;
    
    // Remove all non-digit characters
    const digitsOnly = input.replace(/[^\d]/g, '');
    
    // Update rawPhone
    rawPhone = digitsOnly;
    
    // IMMEDIATELY update the input field to show only digits
    e.target.value = digitsOnly;
    
    // Force Svelte to update phoneNumber immediately
    phoneNumber = digitsOnly ? `+${digitsOnly}` : '';
    
}
    
    $effect(() => {
        if (fullName) {
            const capitalizeFullName = capitalizeName(fullName);
            if (capitalizeFullName !== fullName) {
                fullName = capitalizeFullName;

            }
        }
        if (nickName) {
            const capitalizeNickName = capitalizeName(nickName)
            if (capitalizeNickName !== nickName){
                nickName = capitalizeNickName
            }
        }
        phoneNumber = rawPhone ? `+${rawPhone}` : ''
    })

    let isOpen = $state(false)

</script>
<div class="max-w-4xl mx-auto p-4 md:p-6">
    <!-- Progress Steps - Dark Theme -->
    <div class="mb-10">
        <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">Member Registration</h1>
        <p class="text-gray-400">Complete your membership application in 3 simple steps</p>
        
        <!-- Progress Steps Visual -->
        <div class="flex items-center justify-between mt-8">
            {#each [1, 2, 3] as s}
                <div class="flex-1 flex flex-col items-center relative">
                    <!-- Connector Line -->
                    {#if s > 1}
                        <div class="absolute top-4 left-0 w-1/2 h-0.5 -translate-x-1/2 bg-gray-700"
                             class:bg-blue-500={step >= s}></div>
                    {/if}
                    {#if s < 3}
                        <div class="absolute top-4 right-0 w-1/2 h-0.5 translate-x-1/2 bg-gray-700"
                             class:bg-blue-500={step > s}></div>
                    {/if}
                    
                    <!-- Step Circle -->
                    <div class={`w-10 h-10 rounded-full flex items-center justify-center mb-3 z-10 border-2 ${step >= s ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-700 bg-gray-800 text-gray-400'}`}>
                        {#if step > s}
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                        {:else}
                            <span class="font-semibold">{s}</span>
                        {/if}
                    </div>
                    
                    <!-- Step Label -->
                    <span class="text-sm font-medium"
                          class:text-blue-400={step >= s}
                          class:text-gray-500={step < s}>
                        {s === 1 ? 'Personal Info' : s === 2 ? 'Health Details' : 'Payment'}
                    </span>
                </div>
            {/each}
        </div>
    </div>
    
    <!-- Dark Theme Form Container -->
    <div class="bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 p-6 md:p-8">
        <form onsubmit={handleSubmit} class="space-y-8">
            <!-- Step 1 Content -->
            {#if step === 1}
            <div class="animate-fadeIn">
                <div class="mb-8">
                    <h2 class="text-xl font-bold text-white mb-2">Personal Information</h2>
                    <p class="text-gray-400">Provide your basic details for member identification</p>
                </div>
                
                <!-- Photo Upload Section -->
                <div class="bg-gray-800/50 p-6 rounded-xl border-2 border-dashed border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                    <div class="flex flex-col md:flex-row items-center gap-6">
                        <!-- Photo Preview -->
                        <div class="flex-shrink-0">
                            <div class="w-32 h-32 rounded-xl overflow-hidden border-4 border-gray-900 shadow-lg">
                                {#if photo}
                                    <img class="w-full h-full object-cover"
                                         src={URL.createObjectURL(photo)}
                                         alt="Profile preview" />
                                {:else}
                                    <div class="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                        <svg class="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                        </svg>
                                    </div>
                                {/if}
                            </div>
                        </div>
                        
                        <!-- Upload Controls -->
                        <div class="flex-grow">
                            <h3 class="font-semibold text-gray-300 mb-2">Profile Photo</h3>
                            <p class="text-sm text-gray-500 mb-4">Upload a clear photo for your member card</p>
                            <label class="inline-flex items-center gap-3 cursor-pointer">
                                <div class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25">
                                    {#if photo}
                                        <span class="flex items-center gap-2">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                                            </svg>
                                            Change Photo
                                        </span>
                                    {:else}
                                        <span class="flex items-center gap-2">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                            </svg>
                                            Upload Photo
                                        </span>
                                    {/if}
                                </div>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    class="hidden"
                                    onchange={(e) => {
                                        const target = e.target as HTMLInputElement;
                                        photo = target.files?.[0] || null;
                                    }}
                                    required 
                                />
                                {#if photo}
                                    <span class="text-sm text-green-400 font-medium flex items-center gap-1">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                        </svg>
                                        Photo selected
                                    </span>
                                {/if}
                            </label>
                        </div>
                    </div>
                </div>
                
                <!-- Form Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                    <!-- Full Name -->
                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-gray-300">
                            Full Name <span class="text-red-400">*</span>
                        </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                            </div>
                            <input
                                type="text"
                                bind:value={fullName}
                                class="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white placeholder-gray-500"
                                placeholder="John Smith"
                                required
                            />
                        </div>
                    </div>
                    
                    <!-- Nickname -->
                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-gray-300">
                            Nickname <span class="text-red-400">*</span>
                        </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804L13.51 9.415a4 4 0 015.657 0l1.414 1.414a4 4 0 010 5.657l-8.389 8.389"/>
                                </svg>
                            </div>
                            <input
                                type="text"
                                bind:value={nickName}
                                class="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white placeholder-gray-500"
                                placeholder="Johnny"
                                required
                            />
                        </div>
                    </div>
                    
                    <!-- Gender -->
                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-gray-300">
                            Gender <span class="text-red-400">*</span>
                        </label>
                        <div class="flex gap-3">
                            <label class="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-700 hover:border-blue-500 flex-1 bg-gray-800/50 hover:bg-gray-800 transition-all">
                                <input type="radio" name="gender" value="Male" bind:group={gender} class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600" />
                                <span class="font-medium text-gray-300">Male</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-700 hover:border-blue-500 flex-1 bg-gray-800/50 hover:bg-gray-800 transition-all">
                                <input type="radio" name="gender" value="Female" bind:group={gender} class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600" />
                                <span class="font-medium text-gray-300">Female</span>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Birth Date -->
                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-gray-300">
                            Date of Birth <span class="text-red-400">*</span>
                        </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <input
                                type="date"
                                bind:value={birthdate}
                                class="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white"
                                required
                            />
                        </div>
                        <p class="text-xs text-gray-500">Format: MM/DD/YYYY</p>
                    </div>
                    
                    <!-- Phone Number -->
                    <div class="md:col-span-2 space-y-2">
                        <label class="block text-sm font-semibold text-gray-300">
                            Phone Number <span class="text-red-400">*</span>
                        </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                </svg>
                            </div>
                            <input
                                type="tel"
                                bind:value={phoneNumber}
                                oninput={handlePhoneInput}
                                class="w-full pl-10 pr-32 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white placeholder-gray-500"
                                placeholder="+62 877 2247 9025"
                                required
                            />
                            <button
                                type="button"
                                onclick={sendSMS(rawPhone, nickName, new Date(), 'test')}
                                class="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!phoneNumber.trim() || phoneNumber.trim().length < 10}
                            >
                                Send Test SMS
                            </button>
                        </div>
                        <p class="text-sm text-gray-500">We'll send registration confirmation via SMS</p>
                    </div>
                </div>
                
                <!-- Navigation Buttons -->
                <div class="pt-6 border-t border-gray-800 flex justify-end">
                    <button
                        type="button"
                        onclick={nextStep}
                        class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group"
                        disabled={!photo || !nickName.trim() || !fullName.trim() || !phoneNumber.trim() || !gender || !birthdate}
                    >
                        Continue to Step 2
                        <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                        </svg>
                    </button>
                </div>
            </div>
            {/if}
            
            <!-- Step 2 Content -->
            {#if step === 2}
            <div class="animate-fadeIn">
                <div class="mb-8">
                    <h2 class="text-xl font-bold text-white mb-2">Health & Fitness Details</h2>
                    <p class="text-gray-400">Help us customize your fitness experience</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Medical Info -->
                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-gray-300">
                            Medical Information
                        </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                </svg>
                            </div>
                            <input
                                type="text"
                                bind:value={medicalInfo}
                                class="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white placeholder-gray-500"
                                placeholder="Any medical conditions?"
                            />
                        </div>
                    </div>
                    
                    <!-- Fitness Goal -->
                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-gray-300">
                            Fitness Goal
                        </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                </svg>
                            </div>
                            <select
                                bind:value={fitnessGoal}
                                class="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white appearance-none"
                            >
                                <option value="" class="bg-gray-800">Select your fitness goal</option>
                                <option value="weight_loss" class="bg-gray-800">Weight Loss</option>
                                <option value="muscle_gain" class="bg-gray-800">Muscle Gain</option>
                                <option value="endurance" class="bg-gray-800">Endurance</option>
                                <option value="flexibility" class="bg-gray-800">Flexibility</option>
                                <option value="general" class="bg-gray-800">General Fitness</option>
                            </select>
                            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Preferred Workout Time -->
                    <div class="md:col-span-2 space-y-2">
                        <label class="block text-sm font-semibold text-gray-300">
                            Preferred Workout Time
                        </label>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {#each [
                                { label: 'Morning', time: '6AM-12PM', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' },
                                { label: 'Afternoon', time: '12PM-6PM', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
                                { label: 'Evening', time: '6PM-10PM', icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' },
                                { label: 'Flexible', time: 'Any time', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
                            ] as option}
                                <label class="flex flex-col items-center cursor-pointer p-4 rounded-xl border-2 hover:border-blue-500/50 transition-all bg-gray-800/30 {preferedWorkoutTime.includes(option.label) ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700'}">
                                    <input 
                                        type="radio" 
                                        name="workoutTime" 
                                        bind:group={preferedWorkoutTime}
                                        value={option.label} 
                                        class="hidden" 
                                    />
                                    <svg class="w-6 h-6 text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={option.icon}/>
                                    </svg>
                                    <span class="font-medium text-gray-300 text-sm">{option.label}</span>
                                    <span class="text-xs text-gray-500 mt-1">{option.time}</span>
                                </label>
                            {/each}
                        </div>
                    </div>
                </div>
                
                <!-- Navigation Buttons -->
                <div class="pt-6 border-t border-gray-800 flex justify-between">
                    <button
                        type="button"
                        onclick={prevStep}
                        class="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 group"
                    >
                        <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                        </svg>
                        Back to Step 1
                    </button>
                    <button
                        type="button"
                        onclick={nextStep}
                        class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group"
                        disabled={!fitnessGoal.trim()}
                    >
                        Continue to Step 3
                        <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                        </svg>
                    </button>
                </div>
            </div>
            {/if}
            
            <!-- Step 3 Content -->
            {#if step === 3}
            <div class="animate-fadeIn">
                <div class="mb-8">
                    <h2 class="text-xl font-bold text-white mb-2">Payment & Review</h2>
                    <p class="text-gray-400">Review your information and complete payment</p>
                </div>
                
                <!-- Member Card Preview -->
                <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 border border-gray-700 shadow-xl">
                    <div class="flex flex-col md:flex-row items-center gap-6">
                        <!-- Photo -->
                        <div class="flex-shrink-0">
                            <div class="w-24 h-24 rounded-xl overflow-hidden border-4 border-gray-900 shadow-lg">
                                {#if photo}
                                    <img class="w-full h-full object-cover"
                                         src={URL.createObjectURL(photo)}
                                         alt="Profile preview" />
                                {:else}
                                    <div class="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                        <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                        </svg>
                                    </div>
                                {/if}
                            </div>
                        </div>
                        
                        <!-- Member Info -->
                        <div class="flex-grow">
                            <div class="flex items-start justify-between">
                                <div>
                                    <div class="flex items-center gap-3 mb-2">
                                        <h3 class="text-xl font-bold text-white">{nickName.toUpperCase() || 'MEMBER'}</h3>
                                        <span class="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
                                            28 Days Left
                                        </span>
                                    </div>
                                    <p class="text-sm text-gray-400 mb-1">({fullName || 'Full Name'})</p>
                                    <p class="text-gray-300">{phoneNumber || 'Phone Number'}</p>
                                </div>
                            </div>
                            
                            <div class="flex gap-3 mt-4">
                                <button 
                                    type="button"
                                    class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors text-sm"
                                >
                                    Edit Profile
                                </button>
                                <button 
                                    type="button"
                                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
                                >
                                    Renew Membership
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Payment Method -->
                <div class="space-y-6">
                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-gray-300">
                            Payment Method <span class="text-red-400">*</span>
                        </label>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {#each [
                                { name: 'Cash', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
                                { name: 'Credit Card', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
                                { name: 'E-Wallet', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
                                { name: 'Bank Transfer', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' }
                            ] as method}
                                <label class="flex flex-col items-center cursor-pointer p-4 rounded-xl border-2 hover:border-blue-500 transition-all bg-gray-800/30 {paymentMethod === method.name ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700'}">
                                    <input 
                                        type="radio" 
                                        name="paymentMethod" 
                                        bind:group={paymentMethod}
                                        value={method.name} 
                                        class="hidden" 
                                    />
                                    <svg class="w-8 h-8 text-blue-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={method.icon}/>
                                    </svg>
                                    <span class="font-medium text-gray-300">{method.name}</span>
                                </label>
                            {/each}
                        </div>
                    </div>
                    
                    <!-- Navigation Buttons -->
                    <div class="pt-6 border-t border-gray-800 flex justify-between">
                        <button
                            type="button"
                            onclick={prevStep}
                            class="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 group"
                        >
                            <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                            </svg>
                            Back to Step 2
                        </button>
                        <button
                            type="submit"
                            class="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group"
                        >
                            Complete Registration
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {/if}
        </form>
    </div>
</div>

<style>
    /* Dark theme animations */
    .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Custom scrollbar for dark theme */
    ::-webkit-scrollbar {
        width: 8px;
    }
    
    ::-webkit-scrollbar-track {
        background: #1f2937;
    }
    
    ::-webkit-scrollbar-thumb {
        background: #374151;
        border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: #4b5563;
    }
    
    /* Remove default date picker icon in dark mode */
    input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(1) opacity(0.5);
        cursor: pointer;
    }
    
    input[type="date"]::-webkit-calendar-picker-indicator:hover {
        opacity: 0.8;
    }
</style>