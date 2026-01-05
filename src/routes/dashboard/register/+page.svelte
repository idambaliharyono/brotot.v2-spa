<script lang="ts">
	import { goto } from "$app/navigation";
	import { sendSMS, supabase, uploadToCloudinary } from "$lib/helper";
	import { registerSchema } from "$lib/schemas/registerSchemas";
	import { pageTitle } from "$lib/stores/title";
	import { onMount } from "svelte";

    let nickName = $state('');
    let fullName = $state('');
    let gender = $state('');
    let birthdate = $state('');
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
            phone_number: phoneNumber,
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
    let step = $state(1);
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
    
</script>

<!-- progress step visual -->
<div class="flex items-center justify-between mb-6">
    {#each [1,2,3] as s}
    <div class="flex-1 text-center">
        <div class="h-2 rounded-full mx-2 bg-gray-400"
            class:bg-green-500={step >= s}></div>
        <span class="text-sm"
            class:font-bold={step >= s}>
            {s === 1? 'Info 1' : s === 2 ? 'Info 2' : 'Payment Method'}
        </span>
    </div> 
    {/each}
</div>

<!-- <div class="card card-side bg-black shadow-sm mb-5 w-full">
    <figure class="p-4">
        <div class="avatar">
            <div class="w-24 rounded-xl">
                {#if photo}
                <img
                    class="aspect-square object-cover"
                    src={URL.createObjectURL(photo)}
                    alt='Profile preview'/>
                {:else}
                <div class="bg-gray-400 w-24 h-24 rounded-xl flex items-center justify-center">
                    <span class="text-gray-500">Upload Photo!</span>
                </div>
                {/if} 
                
            </div>
        </div>
    </figure>
    <div class="card-body">
        <h2 class="card-title">
            <span>{nickName.toUpperCase()}</span> 
            <div class="badge bg-green-400 text-white text-xs">28 Days Left</div> 
        </h2>
        <div class="text-[10px] -mt-2">({fullName.toWellFormed()})</div>
        <div> {phoneNumber} </div>
        <div class="card-actions justify-end">
            <button class="mt-5 btn btn-primary"
            >Edit</button>

            <button class="mt-5 btn btn-primary"
            >Renew</button>
        </div>
    </div>

</div> -->
<div class="w-full">
<form onsubmit={handleSubmit} class="flex flex-col gap-5 mx-auto">
    {#if step === 1}
    <!-- step 1 -->
    <div class='step-content'>

    <!-- member card preview -->
        <!-- dispaly picture -->
            <div class="space-y-3">
                <div class="flex flex-col justify-center items-center gap-4">
                    {#if photo}
                    <div class="flex items-center gap-2 text-sm text-green-600">
                <img
                    class="aspect-square object-cover h-35"
                    src={URL.createObjectURL(photo)}
                    alt='Profile preview'/>
                    </div>
                    {/if}

                    <label class="cursor-pointer">
                        {#if photo}
                        <div class="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200 transition-colors">
                            Rechoose Photo
                        </div>
                        {:else} 
                        <div class="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200 transition-colors">
                            Choose Photo for Diplay Picture
                        </div>

                        {/if}
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
                    </label>
                </div>
                <p class="text-xs text-gray-500">Upload a clear photo for your member card (Max 5MB)</p>
            </div> 

        <!-- Form Fields Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Nickname -->
                <div class="space-y-2">
                    <label for="nickname" class="block text-sm font-semibold text-gray-400">
                        Nickname *
                    </label>
                    <input 
                        type="text" 
                        id="nickname" 
                        class="text-black w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        bind:value={nickName}
                        placeholder="e.g., John"
                        required
                    />
                </div>

                <!-- Full Name -->
                <div class="space-y-2">
                    <label for="fullname" class="block text-sm font-semibold text-gray-400">
                        Full Name *
                    </label>
                    <input 
                        type="text" 
                        id="fullname" 
                        class="text-black w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        bind:value={fullName}
                        placeholder="e.g., John Smith"
                        required
                    />
                </div>

                <!-- Phone Number -->
                <div class="md:col-span-2 space-y-2 relative">
                    <label for="phonenumber" class="block text-sm font-semibold text-gray-400">
                        Phone Number *
                    </label>
                    <div class="relative">
                        <input 
                            type="tel" 
                            id="phonenumber" 
                            class="text-black w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            bind:value={phoneNumber}
                            placeholder="+62 877 2247 9025"
                            required
                        />
                        <button type="button"
                        onclick={sendSMS(phoneNumber, nickName, new Date(), 'test')}
                        class="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm font-medium rounded-md border border-purple-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!phoneNumber.trim() || phoneNumber.trim().length < 10}
                        > Test</button>
                    </div>
                    <p class="text-xs text-gray-400">We'll send registration confirmation via SMS</p>
                </div>
            </div>
        <div class="pt-4 border-t border-gray-100">
            <button 
                type="button"
                onclick={nextStep}
                class="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!photo || !nickName.trim() || !fullName.trim() || !phoneNumber.trim()}
            >
                Continue to Step 2 →
            </button>
        </div>
    </div>
    {/if}
    {#if step === 2}
    <div class="form-field">
        <label  for="birthdate">Birth Date</label>
        <input class="text-black" type="date" id="birthdate" bind:value={birthdate} required>
    </div>
    <div class="form-field">
        <label>
            <input type="radio" id="gender" value="Male" bind:group={gender}/>Male
        </label>
        <label>
            <input type="radio" id="gender" value="Female" bind:group={gender}/>Female
        </label>
    </div>
    <div >
        <div >
            <input type="text" id="medicalinfo" bind:value={medicalInfo} placeholder="Sehat" required>
        </div>
        <div >
            <input type="text" id="fitnessgoal" bind:value={fitnessGoal} placeholder="Brotot" required>
        </div>
    </div>
    <div class="form-field">
        <label for="workouttime">Prefered Workout Time</label>
        <input type="text" id="workouttime" bind:value={preferedWorkoutTime} placeholder="Morning" required>
    </div>

    <div class="pt-4 border-gray-100">
        <button 
            type="button"
            onclick={prevStep}
            class="w-full md:w-auto px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
           ← Back to Step 2 
        </button>
    </div>
    <div class="pt-4 border-t border-gray-100">
        <button 
            type="button"
            onclick={nextStep}
            class="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!fitnessGoal.trim() || !medicalInfo.trim() || !preferedWorkoutTime.trim() || !birthdate.trim()}
        >
            Continue to Step 3 →
        </button>
    </div>
    {/if}
    {#if step === 3}
    <div >
        <div >
            <label for="paymentmethod">Payment Method</label>
            <input type="text" id="paymentmethod" bind:value={paymentMethod} placeholder="Cash" required>
        </div>
    </div>
    <div ><button  type="submit">Submit</button></div>
    <button onclick={prevStep}> Previous </button>
    {/if}



    
</form>
    
</div>

<style global>
    .form-field {
        @apply flex flex-col w-4/5 align-middle;
    }
    .form-field-group {
        @apply flex;
    }
</style>